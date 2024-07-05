/* eslint-disable prettier/prettier */
const catchAsync=require("../utils/catchAsync")
const AppError=require("../utils/appError")
const APIFeatures=require('../utils/apiFeatures')
exports.deleteOne=Model=>
catchAsync( async (req, res,next) => {

    const doc= await Model.findByIdAndDelete(req.params.id);
    if(!doc){
     return next(new AppError(`No Document Found With that ID`,404))
    }
    res.status(204).json({
        status: 'success',
    });
    
  
}
);

exports.updateOne=Model=>catchAsync( async (req, res,next) => {
 
    const  data= await Model.findByIdAndUpdate(req.params.id, req.body , {new: true,
    runValidators:true});
      if(!data){
     return next(new AppError('no Tour Found WIth That ID',404))
    }
    res.status(200).json({
      status: 'modified',
      data
    });
  
}
);


exports.createOne = Model=>catchAsync(async (req, res,next) => {
  const newData =await Model.create(req.body)
  res.status(201).json({
    status: 'success',
    data: {
      newData
    },
  });

}
)


exports.getOne=(Model,popOptions)=> catchAsync( async (req, resp,next) => {
  let query=Model.findById(req.params.id);

if(popOptions) query=query.populate(popOptions);

    const doc= await query;

    if(!doc){
     return next(new AppError('no Document Found WIth That ID',404))
    }
    resp.status(200).json({
      status: 'success',
      data: {
        data:doc
      },
    });
 


}

);


exports.getAll= Model =>catchAsync(async (req, resp,next) => {
let filter={}

    if(req.params.tourId) filter={tour:req.params.tourId}
    const features=new APIFeatures(Model.find(filter),req.query).filter().sort().limitFields().paginate()
    const doc= await features.query;
    console.log(req.params.tourId);

    resp.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        doc
      },
    });
  
}
); 