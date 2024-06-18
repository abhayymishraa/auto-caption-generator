import { DeleteObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { GetTranscriptionJobCommand, StartTranscriptionJobCommand, TranscribeClient } from '@aws-sdk/client-transcribe';

function getClient() {
    return new TranscribeClient({
        region: "ap-south-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
    });
}

function createTranscriptionCommand(filename) {
    return new StartTranscriptionJobCommand({
        TranscriptionJobName: filename,
        OutputBucketName: process.env.BUCKET_NAME,
        OutputKey: filename + '.transcription',
        IdentifyLanguage: true,
        Media: {
            MediaFileUri: 's3://' + process.env.BUCKET_NAME + '/' + filename,
        }
    })
}

async function createTranscriptionJob(filename) {
    const transcribeClient = getClient();

    const command = createTranscriptionCommand(filename);
    return transcribeClient.send(command);
}




async function getTranscriptionJob(filename) {
    const transcribeClient = getClient();
    let jobStatusResult = null;
    try {
        const transcriptionJobStatus = new GetTranscriptionJobCommand({
            TranscriptionJobName: filename,
        });
        jobStatusResult = await transcribeClient.send(transcriptionJobStatus);
       
    } catch (err) {}

    return jobStatusResult;
    }

    async function getTranscriptionFile(filename) {
        const transcriptionFile = filename + '.transcription';
        const s3client = new S3Client({
            region: "ap-south-1",
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
        const getObjectCommand = new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: transcriptionFile,
        });
        let transcriptionFileResponse = null;
        try {
            transcriptionFileResponse = await s3client.send(getObjectCommand);
        } catch (err) {}

        if (transcriptionFileResponse) {
            const buffer = await new Response(transcriptionFileResponse.Body).arrayBuffer();
            const decoder = new TextDecoder("utf-8");
            
          return decoder.decode(buffer);
        }
        return null;

    }
    

    async function deleteTranscriptionFiles(filename) {
        setTimeout(async() => {
            console.log('Deleting transcription files');
            const s3client = new S3Client({
                region: "ap-south-1",
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                },
            });
            
            const deleteObjectCommand = new DeleteObjectCommand({
                Bucket: process.env.BUCKET_NAME,
                Key: filename,
            });
            
            const deleteTranscriptionObjectCommand = new DeleteObjectCommand({
                Bucket: process.env.BUCKET_NAME,
                Key: filename + '.transcription',
            });
            
            try {
                await s3client.send(deleteObjectCommand);
                await s3client.send(deleteTranscriptionObjectCommand);
                console.log('Deleted transcription files');
            } catch (err) {
                // Handle error
                console.log(err);
            }
        }, 1000 * 60 * 30);
        }


export async function GET(req) {

    const url = new URL(req.url);
    const filename = url.searchParams.get('filename');
    const transcribeClient = getClient();

    //check if the file exists in the bucket'
    const existingJob = await getTranscriptionJob(filename);

    // find ready transcription job
     const transcription = await getTranscriptionFile(filename);
     if(transcription){

    // Call the deleteTranscriptionFiles function
       deleteTranscriptionFiles(filename);

        return Response.json({
            status: 'COMPLETED',
            transcription: JSON.parse(transcription),
        })
     }


    if(existingJob){
        return Response.json({
            status: existingJob.TranscriptionJob.TranscriptionJobStatus,
        });
    }

    // create a new job if it doesn't exist 
    if (!existingJob) {
       const newJob = await createTranscriptionJob(filename);
        return Response.json({
            status: newJob.TranscriptionJob.TranscriptionJobStatus,
        });
    }


    return Response.json(null)
}

