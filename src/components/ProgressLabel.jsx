import { Progress } from "@material-tailwind/react";
 
export default function ProgressLabel({value}) {

  return <Progress value={value} className="sm:w-full w-[80vw]" label="Completed" />;
}