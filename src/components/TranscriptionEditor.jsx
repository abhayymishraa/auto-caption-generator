import TranscriptionItems from "../components/TranscriptionItems";

export default function TranscriptionEditor({
  awsTranscriptionItems,
  setAwsTranscriptionItems,
}) {
  function updateTranscriptionItems(index, prop, e) {
    const newItems = [...awsTranscriptionItems];
    newItems[index][prop] = e.target.value;
    setAwsTranscriptionItems(newItems);
  }

  return (
    <div className=" h-full">
      <h2 className="text-2xl mb-4 font-semibold text-white/80">
        Transcription
      </h2>
      <div className="grid grid-cols-3 sticky top-0 bg-text-pretti p-2 rounded-md ">
        <div>From </div>
        <div>End </div>
        <div>Content</div>
      </div>
      <div className="sm:h-full h-[50vh] sm:overflow-auto overflow-scroll">
        {awsTranscriptionItems.length > 0 &&
          awsTranscriptionItems.map((item, key) => (
            <div key={key}>
              <TranscriptionItems
                handleStartTimeChange={(e) =>
                  updateTranscriptionItems(key, "start_time", e)
                }
                handleEndTimeChange={(e) =>
                  updateTranscriptionItems(key, "end_time", e)
                }
                handleContentChange={(e) =>
                  updateTranscriptionItems(key, "content", e)
                }
                item={item}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
