

const internModel = require("../models/internModel")
const collegeModel = require("../models/collegeModel")


//--CREATING COLLEGE

const createCollege = async function (req, res) {
  try {
    let Body = req.body 
    let arr = Object.keys(Body)
    let logoLink = req.body.logoLink;
    let name = req.body.name;
    let fullName = req.body.fullName;
   
    let url =/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*\.(?:png|jpg|jpeg))*$/.test(logoLink);
    let name1 = /^[a-zA-Z]{2,45}$/.test(name);

    let colleges = await collegeModel.findOne({ name : name});

    if (arr.length==0) return res.status(400).send({ status: false , msg: "Invalid request. Please provide Details" })

    if (!name || !fullName || !logoLink) return res.status(400).send({ status: false , msg: "Input field missing" })
    
    if (name1 == false) return res.status(400).send({ status: false , msg: "Please Enter valid name." });
    
    if (url == false) return res.status(400).send({ status: false , msg: "Please Enter valid URL." });
    
    if (colleges) return res.status(400).send({ status: false , msg: "This College already exist" })
    
    if (!colleges) {
      let dataCreated = await collegeModel.create(Body);
      res.status(201).send({  status: true ,data: dataCreated });
    }
  } catch (err) {
    res.status(500).send({  status: false , msg: "Server not responding", error: err.message });
  }
}

  
//**********************************************************************//
//--CREATING INTERN

  const createIntern = async function(req, res){
    try{
      let data = req.body
      let arr = Object.keys(data)
      let Name = /^[a-zA-Z ]{2,45}$/.test(req.body.name);
      let Email = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(req.body.email)
      let Mobile = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/.test(req.body.mobile) 
      let intern = await internModel.findOne({ email : req.body.email});
      let mobileNo = await internModel.findOne({ mobile : req.body.mobile});
  
      if (arr.length === 0) return res.status(400).send({ status: false, message: "Invalid request. Please provide Details" })

      if(!data.name) return res.status(400).send({ status: false, massage: "Name is reqired" });

      if(!data.email) return res.status(400).send({ status: false, massage: "Email is required" });

      if(!data.mobile) return res.status(400).send({status:false, massage:"moblie number is required"})

      if(!data.collegeName) return res.status(400).send({status:false, massage:"college Name is required"})

      if (Name == false) return res.status(400).send({status:false , message: "Please Enter valid name." })

      if (Email == false) return res.status(400).send({status:false , message: "Please Enter valid email." })

      if(intern) return res.status(400).send({status: false, message: "email already exist!"})

      if (Mobile == false) return res.status(400).send({status:false , message: "Please Enter valid mobile number." })

      if(mobileNo) return res.status(400).send({status: false, message: "mobile number already exist!"})

      let getData = await collegeModel.findOne({ name: data.collegeName}).select({ _id: 1 })

      if (!getData) return res.status(404).send({ status: false, message: "Enter a valid college name" })

      data.collegeId = getData._id; //adding new element "collegeId" in object data.
      
      let showInterData = await internModel.create(data);
      res.status(201).send({ status: true, massage: showInterData });
  
    } catch (err) {
    res.status(500).send({  status: false , msg: "Server not responding", error: err.message });
  }
  };


//**********************************************************************//
  
//--COLLEGE DETAILS ALONG WITH INTERN LIST

  const collegeDetails =async function(req ,res){
  try{
      const info = req.query.collegeName
      if(!info) return res.status(400).send({status:false , message:"Please Enter College Name"})

      const college = await collegeModel.findOne({name: info ,isDeleted:false})
      if(!college) return res.status(404).send({status:false , message:"Did not found college with this name."})

      const { name, fullName, logoLink } = college 
     
      const data = { name, fullName, logoLink };
      
      const collegeIdFromcollege = college._id;

      const internList = await internModel.find({ collegeId: collegeIdFromcollege,isDeleted:false});

      if (internList.length==0) return res.status(404).send({ status: false, message: `We Did not Have Any Intern With ${info} College` })

      data["interests"] = internList 
      res.status(200).send({ status: true, data: data });
  }catch (err){
    res.status(500).send({  status: false , msg: "Server not responding", error: err.message });
  }
  }

//**********************************************************************//


module.exports.createIntern = createIntern;

module.exports.createCollege = createCollege;

module.exports.collegeDetails =collegeDetails;




//*****************************************************************************//

//College of Engineering ,Pune
//https://functionup-stg.s3.ap-south-1.amazonaws.com/uranium/coep.jpg


//h.v.desai college of technology, pune
//https://functionup-stg.s3.ap-south-1.amazonaws.com/uranium/hvdesai-college.jpeg












//***CREATE COLLEGE INPUT***//

// {
//   "name" : "coep",
//   "fullName" : "College Of Engineering,Pune",
//   "logoLink" : "https://functionup-stg.s3.ap-south-1.amazonaws.com/uranium/coep.jpg"
// }

//***CREATE INTERN INPUT***//
// {
//   "name" : "pqr",
//   "email" : "pqr1@coep.in",
//   "mobile" : "9000090033",
//   "collegeName" : "coep"
// }