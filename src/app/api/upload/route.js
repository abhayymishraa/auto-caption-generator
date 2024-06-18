import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import uniqid from "uniqid";


export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");
        // Process the file here
        const { name, type } = file;
        const data = await file.arrayBuffer();
        console.log("before s3");
        const s3client = new S3Client({
            region: "ap-south-1",
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
        console.log("after s3");

        const id = uniqid();
        const ext = name.split(".").pop();
        const fileName = id + `.${ext}`;
        console.log(fileName);

        const command = new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Body: data,
            ACL: "public-read",
            ContentType: type,
            Key: fileName,
        });
    
        const send =  await s3client.send(command);
        if(send) console.log("upload success");

        return Response.json({name,ext,fileName,id})
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Internal Server Error" });
    }
}