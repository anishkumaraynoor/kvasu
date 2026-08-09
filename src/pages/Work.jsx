import React, { Component, useState } from 'react';
import { Col, Row } from 'react-bootstrap'
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import { saveAs } from 'file-saver';
import expressionParser from 'docxtemplater/expressions';
import { getStudentAPI, updateStudentAPI } from '../services/allAPI';

function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}


function Work() {
  let today = new Date().toISOString().split('T')[0]
  const [tcData, setTcData] = useState({
    tcno:"",tcdate:today,name:"",dob:"",admno:"",admdate:"",sem:"",dateleft:"",sem1:"",subject:"Course Completed",
    course:"Yes",due:"Yes",scholarship:"Satisfactory",examination:"",leftdate:"",applidate:today,
    issuedate:today, id:""
  })
  const [mob, setMob] = useState("")
  const [duplicate, setDuplicate] = useState("")

  const formatDate = (value)=>{
    var dataArray = value.split('-')
    var dataFormat = dataArray[2]+'-'+dataArray[1]+'-'+dataArray[0]
    return dataFormat
  }

  
  const getStudent = async (s) => {
    try {
        const reqHeader = {
          "Content-Type": "application/json",
        }
        const result = await getStudentAPI(s,reqHeader)
        if (result.status === 200) {
          let baseData = result.data
          
          if(baseData.tcno!=''){
            if(confirm("TC Already Issued to This Student... Do you want DUPLICATE TC?")==true){
              setTcData({...tcData,name:baseData.name,sem:baseData.class,sem1:"I"+baseData.class,admdate:baseData.admdate,
                leftdate:baseData.leftdate,dateleft:baseData.leftdate,dob:baseData.dob,subject:baseData.subject,tcno:baseData.tcno, admno:baseData.admno, id:baseData._id})
                setDuplicate("//   DUPLICATE   //")
            }else{
              setTcData({tcno:"",tcdate:today,name:"",dob:"",admno:"",admdate:"",sem:"",dateleft:"",
              sem1:"",subject:"Course Completed",course:"Yes",due:"Yes",scholarship:"Satisfactory",
              examination:"",leftdate:"",applidate:today,issuedate:today, id:""})
            }
          }else{
            setTcData({...tcData,name:baseData.name,sem:baseData.class,sem1:"I"+baseData.class,admdate:baseData.admdate,
            leftdate:baseData.leftdate,dateleft:baseData.leftdate,dob:baseData.dob,subject:baseData.subject,tcno:baseData.nextTcNo, admno:baseData.admno, id:baseData._id})
            setDuplicate("")
          }
        }else{
          console.log(result);
        }
      
    } catch (error) {
      console.log(error);
    }
  }



  const handleUpdateStudent = async()=>{
    const {id,tcno,tcdate} = tcData
    


      const reqBody = new FormData()
      reqBody.append('tcno',tcno)
      reqBody.append('tcdate',tcdate)

      
        const reqHeader = {
          "Content-Type":"application/json",
        }
        console.log("proceed to api call");
        try {
          const result = await updateStudentAPI(id,reqBody,reqHeader)
          if(result.status===200){
            alert("updated successfully")
          }else{
            console.log(result);
          }
        } catch (error) {
          console.log(error);
        }
      
    
  }
  

  const generateDocument = () => {

    handleUpdateStudent()

    loadFile(
      '/tc.docx',
      function (error, content) {
        if (error) {
          throw error;
        }
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
          parser: expressionParser,
        });
        
        
        doc.render({...tcData, admdate:formatDate(tcData.admdate),
          dob:formatDate(tcData.dob), tcdate:formatDate(tcData.tcdate),
          dateleft:formatDate(tcData.dateleft),
          leftdate:formatDate(tcData.leftdate), applidate:formatDate(tcData.applidate),
          issuedate:formatDate(tcData.issuedate),duplicate : duplicate});
        const out = doc.getZip().generate({
          type: 'blob',
          mimeType:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        }); //Output the document using Data-URI
        saveAs(out, `${tcData.name}.doc`);
      }
    );
  };

  const generateCC = () => {

    loadFile(
      '/cc.docx',
      function (error, content) {
        if (error) {
          throw error;
        }
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
          parser: expressionParser,
        });
        
        
        doc.render({...tcData, tcdate:formatDate(tcData.tcdate), admdate:formatDate(tcData.admdate),
          leftdate:formatDate(tcData.leftdate), dateleft:formatDate(tcData.dateleft),
          issuedate:formatDate(tcData.issuedate), sem:tcData.sem.split(' ')[1]});
        const out = doc.getZip().generate({
          type: 'blob',
          mimeType:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        }); //Output the document using Data-URI
        saveAs(out, `${tcData.name}(CC).doc`);
      }
    );
  };

  return (
    <>
      <div className='container' style={{ border: '5px solid white', height: '87vh' }}>
        <Row>
          <Col lg={6}>
            <Row className='container'>
            
              

              
              <Col className='mt-1' lg={6}>
              <label htmlFor="">Date</label><br />
                <input onChange={e=>setTcData({...tcData, tcdate:e.target.value})} value={tcData.tcdate} className='' type="date" name="tcdate" id="" />
              </Col>
              <Col className='mt-1' lg={6}>
                <label htmlFor="">Name</label><br />
                <input onChange={e=>setTcData({...tcData, name:e.target.value})} value={tcData.name} className='' type="text" name="" id="" />
              </Col>
              <Col className='mt-1' lg={6}>
                <label htmlFor="">Admission No.</label><br />
                <input onChange={e=>setTcData({...tcData, admno:e.target.value})} value={tcData.admno} className='' type="text" name="" id="" />
              </Col>
              <Col className='mt-1' lg={6}>
              <label htmlFor="">Date of Birth</label><br />
                <input onChange={e=>setTcData({...tcData, dob:e.target.value})} value={tcData.dob} className='' type="date" name="dob" id="" />
              </Col>

              
              
              <Col className='mt-1' lg={6}>
                <label htmlFor="">Class</label><br />
                <select onChange={e=>setTcData({...tcData, sem:e.target.value, examination:e.target.value})} value={tcData.sem} name="" id="">
                <option value="">--select--</option>
                <option value="BVSc & AH" >BVSc & AH</option>
                <option value="MVSc" >MVSc</option>
                <option value="PhD" >PhD</option>
                <option value="Diploma in Dairy Science" >Diploma in Dairy Science</option>
                <option value="Diploma in Feed Technology" >Diploma in Feed Technology</option>
                <option value="Diploma in Laboratory Techniques" >Diploma in Laboratory Techniques</option>
                <option value="MSc Animal Sciences" >MSc Animal Sciences</option>
                <option value="MSc Animal Biotechnology" >MSc Animal Biotechnology</option>
                <option value="MSc Applied Microbiology" >MSc Applied Microbiology</option>
                <option value="MSc Applied Toxicology" >MSc Applied Toxicology</option>
                <option value="MSc Biochemistry & Molecular Biology" >MSc Biochemistry & Molecular Biology</option>
                <option value="MSc Quality Control in Dairy Industry" >MSc Quality Control in Dairy Industry</option>
                <option value="MSc Biostatistics" >MSc Biostatistics</option>
              </select>
              </Col>
              <Col className='mt-1' lg={6}>
              <label htmlFor="">Date of Admission</label><br />
                <input onChange={e=>setTcData({...tcData, admdate:e.target.value})} value={tcData.admdate} className='' type="date" name="admdate" id="" />
              </Col>

              
              <Col className='mt-1' lg={6}>
              <label htmlFor="">Whether qualified</label><br />
              <select onChange={e=>setTcData({...tcData, course:e.target.value})} name="" id="">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              </Col>
              <Col className='mt-1' lg={6}>
                <label htmlFor="">Whether dues discharged</label><br />
                <select onChange={e=>setTcData({...tcData, due:e.target.value})} name="" id="">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              </Col>

              

              <Col className='mt-1' lg={6}>
                <label htmlFor="">Name of Examination</label><br />
                <input onChange={e=>setTcData({...tcData, examination:e.target.value})} value={tcData.examination} className='' type="text" name="" id="" />
              </Col>
              <Col className='mt-1' lg={6}>
              <label htmlFor="">Date of Completion of Course</label><br />
                <input onChange={e=>setTcData({...tcData, leftdate:e.target.value, dateleft:e.target.value})} value={tcData.leftdate} className='' type="date" name="leftdate" id="" />
              </Col>
              <Col className='mt-1' lg={6}>
                <label htmlFor="">Reason for Transfer</label><br />
                <select onChange={e=>setTcData({...tcData, subject:e.target.value})} name="" id="">
                <option value="Course Completed">Course Completed</option>
                <option value="Discontinued">Discontinued</option>
              </select>
              </Col>




              <Col className='mt-1' lg={6}>
              <label htmlFor="">Character</label><br />
              <select onChange={e=>setTcData({...tcData, scholarship:e.target.value})} name="" id="">
                <option value="Satisfactory">Satisfactory</option>
                <option value="Good">Good</option>
              </select>
              </Col>


              <Col className='mt-1' lg={6}>
                <label htmlFor="">Date of application for TC</label><br />
                <input onChange={e=>setTcData({...tcData, applidate:e.target.value})} value={tcData.applidate} className='' type="date" name="applidate" id="" />
              </Col>
              <Col className='mt-1' lg={6}>
              <label htmlFor="">Date of Leaving</label><br />
                <input onChange={e=>setTcData({...tcData, dateleft:e.target.value})} value={tcData.dateleft} className='' type="date" name="dateleft" id="" />
              </Col>



            </Row>
          </Col>
          <Col lg={6} >
            
            
            <button onClick={generateDocument} className='btn btn-primary mt-3'>TC</button>
            <button onClick={generateCC} className='btn btn-warning mt-3'>Conduct Certificate</button>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Work