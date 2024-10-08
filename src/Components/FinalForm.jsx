import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import thankyouImage from "../../public/assets/slam-style-logo.png";
const FinalForm = ({ stepIdData, stepIDS }) => {
  const [formData, setFormData] = useState({
    contactname: "",
    emailaddress: "",
    pcontact: "",
    scontact: "",
    pcalltime: "2024-07-04T00:00",
    postcode: "",
    uniform_number: "",
    date_uniform: "2024-07-04T00:00",
    comments: "",
  });

  const [isThankYouVisible, setIsThankYouVisible] = useState(false);

  let firstClick = false;
  let clickTimer = null;

  const startAgain = (e) => {
    e.preventDefault();
    if (!firstClick) {
      firstClick = true;
      toast.info("Press again to exit", {
        position: "top-right",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      clickTimer = setTimeout(() => {
        firstClick = false;
      }, 8000); // 2 seconds window to detect double-click
    } else {
      clearTimeout(clickTimer);
      stepIdData(1);
    }
  };

  const jerseyFrontRef = localStorage.getItem("front");
  const jerseyBackRef = localStorage.getItem("back");
  const jerseyLeftRef = localStorage.getItem("left");
  const jerseyRightRef = localStorage.getItem("right");

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let formErrors = {};

    // Regular expression for validating email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.contactname)
      formErrors.contactname = "Contact Name is required.";
    if (!formData.emailaddress) {
      formErrors.emailaddress = "Email Address is required.";
    } else if (!emailPattern.test(formData.emailaddress)) {
      formErrors.emailaddress = "Invalid Email Address format.";
    }
    if (!formData.pcontact)
      formErrors.pcontact = "Primary Contact Number is required.";
    if (!formData.pcalltime)
      formErrors.pcalltime = "Preferred time to call is required.";
    if (!formData.postcode) formErrors.postcode = "Postcode is required.";
    if (!formData.uniform_number)
      formErrors.uniform_number = "Number of uniforms required is required.";
    if (!formData.date_uniform)
      formErrors.date_uniform =
        "Date by which uniforms are required is required.";
    if (!formData.comments) formErrors.comments = "Comments are required.";

    setErrors(formErrors);

    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      generatePDF();
    }
  };

  const StartAgain = () => {
    window.location.reload();
    stepIDS(1);
  };

  const generatePDF = async () => {
    const pdf = new jsPDF();

    // First page
    const refs = [
      { ref: jerseyFrontRef, x: 10, y: 110 },
      { ref: jerseyBackRef, x: 110, y: 110 },
    ];

    // Second page
    const refsSecondPage = [
      { ref: jerseyLeftRef, x: 10, y: 80 },
      { ref: jerseyRightRef, x: 110, y: 80 },
    ];

    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const textWidth =
      (pdf.getStringUnitWidth("Contact Information") *
        pdf.internal.getFontSize()) /
      pdf.internal.scaleFactor;
    const x = (pageWidth - textWidth) / 2;
    pdf.text("Contact Information", x, 16);

    const lineX = 14;
    const lineY = 18;
    const lineWidth = pageWidth - 28;
    pdf.setLineWidth(0.5);
    pdf.line(lineX, lineY, lineX + lineWidth, lineY);

    pdf.autoTable({
      startY: 22,
      head: [],
      body: [
        [
          { content: "Contact Name:", styles: { fontStyle: "bold" } },
          formData.contactname,
          { content: "Email Address:", styles: { fontStyle: "bold" } },
          formData.emailaddress,
        ],
        [
          { content: "Primary Contact Number:", styles: { fontStyle: "bold" } },
          formData.pcontact,
          {
            content: "Secondary Contact Number:",
            styles: { fontStyle: "bold" },
          },
          formData.scontact,
        ],
        [
          { content: "Preferred time to call:", styles: { fontStyle: "bold" } },
          formData.pcalltime,
          { content: "Postcode:", styles: { fontStyle: "bold" } },
          formData.postcode,
        ],
        [
          {
            content: "Number of uniforms required:",
            styles: { fontStyle: "bold" },
          },
          formData.uniform_number,
          {
            content: "Date by which uniforms are required:",
            styles: { fontStyle: "bold" },
          },
          formData.date_uniform,
        ],
        [
          { content: "Comments:", styles: { fontStyle: "bold" } },
          formData.comments,
          "",
          "",
        ],
      ],
      theme: "plain",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [255, 255, 255] },
      bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 60 },
        2: { cellWidth: 50 },
        3: { cellWidth: 70 },
      },
    });

    // Add data on the first page
    for (let { ref, x, y } of refs) {
      if (ref) {
        const imageDataUrl = ref;
        pdf.addImage(imageDataUrl, "PNG", x, y);
      }
    }

    pdf.addPage();

    // Add data on the second page
    for (let { ref, x, y } of refsSecondPage) {
      if (ref) {
        const imageDataUrl = ref;
        pdf.addImage(imageDataUrl, "PNG", x, y);
      }
    }

    const pages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(44);
      pdf.setTextColor(200);
      const pageHeight = pdf.internal.pageSize.height;
      const watermarkText = "1300251107||Slamstyle";
      const textHeight = -404 / pdf.internal.scaleFactor;
      pdf.text(watermarkText, 40, (pageHeight - textHeight) / 2, null, 40);
    }

    return pdf;
  };
  const handleClickSave = async () => {
    const pdfData = await generatePDF();
    const pdfBlob = pdfData.output("blob");
    const formdata = new FormData();
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
    if (
      formData.contactname &&
      isValidEmail(formData.emailaddress) &&
      formData.pcontact &&
      formData.pcalltime &&
      formData.postcode &&
      formData.uniform_number &&
      formData.date_uniform &&
      formData.comments != " "
    ) {
      formdata.append("contact_name", formData.contactname);
      formdata.append("email", formData.emailaddress);
      formdata.append("primary_contact", formData.pcontact);
      formdata.append("secondary_contact", formData.scontact);
      formdata.append("preferred", formData.pcalltime);
      formdata.append("postcode", formData.postcode);
      formdata.append("uniforms", formData.uniform_number);
      formdata.append("uniforms_date", formData.date_uniform);
      formdata.append("comment", formData.comments);
      formdata.append("image", pdfBlob);

      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      };

      fetch(
        `${import.meta.env.VITE_API_KEY_POST_UNIFORM}/wp-json/custom/v1/insert_uniform_data`,
        requestOptions
      )
        .then((response) => {
          if (response.status === 200) {
            setIsThankYouVisible(true);
          }
          return response.text();
        })
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    } else {
      // alert("enter values");
    }
  };

  return (
    <>
      {isThankYouVisible ? (
        <div className="thankyouMessage">
          <div className="thank-you-component">
            <h2 style={{ color: "#fff" }}>Thank you for your submission!</h2>
            <div className="thankyou-image-content">
              <img src={thankyouImage} className="thankyouImage" />
              <p style={{ color: "#fff" }}>
                Thank you for your submission! We will contact you soon.
              </p>
              <button onClick={StartAgain} className="unifromBtn">
                Create Another Uniform
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="customize-form">
          <div className="header-sec">
            <h3>Contact Information</h3>
          </div>
          <div className="customize-form-layout">
            <form id="leadForm" onSubmit={handleSubmit}>
              <input type="hidden" name="action" value="ub_save_lead" />
              <textarea
                id="wgz_front_src"
                name="front"
                style={{ display: "none" }}
              ></textarea>
              <textarea
                id="wgz_back_src"
                name="back"
                style={{ display: "none" }}
              ></textarea>
              <textarea
                id="wgz_left_src"
                name="left"
                style={{ display: "none" }}
              ></textarea>
              <textarea
                id="wgz_right_src"
                name="right"
                style={{ display: "none" }}
              ></textarea>
              <div className="custom-form">
                <div className="flex-row flex-col-2">
                  <div className="flex-col">
                    <div className="form-group">
                      <input
                        type="text"
                        name="contactname"
                        id="contactname"
                        placeholder="Contact Name*"
                        value={formData.contactname}
                        onChange={handleChange}
                      />
                      {errors.contactname && (
                        <span
                          className="error"
                          style={{
                            float: "left",
                            fontSize: "14px",
                            padding: "10px 0px 10px 0px",
                          }}
                        >
                          {errors.contactname}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-col">
                    <div className="form-group">
                      <input
                        type="email"
                        name="emailaddress"
                        id="emailaddress"
                        placeholder="Email Address*"
                        value={formData.emailaddress}
                        onChange={handleChange}
                      />
                      {errors.emailaddress && (
                        <span
                          className="error"
                          style={{
                            float: "left",
                            fontSize: "14px",
                            padding: "10px 0px 10px 0px",
                          }}
                        >
                          {errors.emailaddress}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex-row flex-col-2">
                  <div className="flex-col">
                    <div className="form-group">
                      <input
                        type="tel"
                        name="pcontact"
                        id="pcontact"
                        placeholder="Primary Contact Number*"
                        value={formData.pcontact}
                        onChange={handleChange}
                      />
                      {errors.pcontact && (
                        <span
                          className="error"
                          style={{
                            float: "left",
                            fontSize: "14px",
                            padding: "10px 0px 10px 0px",
                          }}
                        >
                          {errors.pcontact}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-col">
                    <div className="form-group">
                      <input
                        type="tel"
                        name="scontact"
                        id="scontact"
                        placeholder="Secondary Contact Number"
                        value={formData.scontact}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex-row flex-col-2">
                  <div className="flex-col">
                    <div className="form-group">
                      <input
                        type="datetime-local"
                        name="pcalltime"
                        id="pcalltime"
                        placeholder="Preferred time to call"
                        value={formData.pcalltime}
                        onChange={handleChange}
                      />
                      {errors.pcalltime && (
                        <span
                          className="error"
                          style={{
                            float: "left",
                            fontSize: "14px",
                            padding: "10px 0px 10px 0px",
                          }}
                        >
                          {errors.pcalltime}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-col">
                    <div className="form-group">
                      <input
                        type="number"
                        name="postcode"
                        id="postcode"
                        placeholder="Postcode*"
                        value={formData.postcode}
                        onChange={handleChange}
                      />
                      {errors.postcode && (
                        <span
                          className="error"
                          style={{
                            float: "left",
                            fontSize: "14px",
                            padding: "10px 0px 10px 0px",
                          }}
                        >
                          {errors.postcode}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex-row flex-col-2">
                  <div className="flex-col">
                    <div className="form-group">
                      <input
                        type="number"
                        name="uniform_number"
                        id="uniform_number"
                        placeholder="Number of uniforms required"
                        autoComplete="true"
                        value={formData.uniform_number}
                        onChange={handleChange}
                      />
                      {errors.uniform_number && (
                        <span
                          className="error"
                          style={{
                            float: "left",
                            fontSize: "14px",
                            padding: "10px 0px 10px 0px",
                          }}
                        >
                          {errors.uniform_number}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-col">
                    <div className="form-group">
                      <input
                        type="datetime-local"
                        name="date_uniform"
                        id="date_uniform"
                        placeholder="Date by which uniforms are required"
                        autoComplete="true"
                        value={formData.date_uniform}
                        onChange={handleChange}
                      />
                      {errors.date_uniform && (
                        <span
                          className="error"
                          style={{
                            float: "left",
                            fontSize: "14px",
                            padding: "10px 0px 10px 0px",
                          }}
                        >
                          {errors.date_uniform}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex-row">
                  <div className="flex-col">
                    <div className="form-group">
                      <textarea
                        name="comments"
                        id="comments"
                        cols="40"
                        rows="6"
                        placeholder="Other Comments*"
                        value={formData.comments}
                        onChange={handleChange}
                      ></textarea>
                      {errors.comments && (
                        <span
                          className="error"
                          style={{
                            float: "left",
                            fontSize: "14px",
                            padding: "10px 0px 10px 0px",
                          }}
                        >
                          {errors.comments}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="wrapper-button">
                  <button
                    className="btn-design"
                    name="startAgain"
                    onClick={startAgain}
                  >
                    Start Again
                  </button>
                  <ToastContainer />
                  <button
                    className="btn-design"
                    value="Send"
                    name="saveImage"
                    onClick={handleClickSave}
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FinalForm;
