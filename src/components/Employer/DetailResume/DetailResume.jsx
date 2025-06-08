import ViewCV from "../../Student/CV/ViewCV";
import "./DetailResume.scss";
import { useLocation } from "react-router-dom";
import { ModalInterview } from "../Applicant/ViewDetailApplicant";
import { useState } from "react";
const DetailResume = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <ViewCV />
      <ModalInterview
        open={open}
        setOpen={setOpen}
        studentId={location.state.datasource.id}
      />
    </div>
  );
};
export default DetailResume;
