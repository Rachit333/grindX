// import mongoose from "mongoose";
// import { v4 as uuidv4 } from "uuid"; 

// const studyPlanSchema = new mongoose.Schema({
//   uid: { type: String, default: uuidv4, unique: true }, 
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   email: { type: String, required: true },
//   duration: { type: String, required: true },
//   difficulty: { type: String, required: true },
//   topics: { type: [String], required: true },
//   rating: { type: Number, required: true, min: 1, max: 5 },
//   participants: { type: Number, required: false, min: 0, default: 0 },
//   publicity: { type: Number, required: true, enum: [0, 1, 2, 3] }, // public-> (0) || private -> (1) || unlisted -> (2) || restricted -> (3)
//   authorizedUsers: { type: [String], default: [] },
//   createdOn: { type: Date, default: Date.now }, 
// });

// studyPlanSchema.pre("save", function (next) {
//   if (this.isNew && !this.authorizedUsers.includes(this.email)) {
//     this.authorizedUsers.push(this.email);
//   }
//   next();
// });

// export const StudyPlans = mongoose.models.StudyPlans || mongoose.model("StudyPlans", studyPlanSchema);






























import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const studyPlanSchema = new mongoose.Schema({
  uid: { type: String, default: uuidv4, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  email: { type: String, required: true }, 
  duration: { type: String, required: true },
  difficulty: { type: String, required: true },
  topics: { type: [String], required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  participants: { type: Number, default: 0, min: 0 },
  publicity: { type: Number, required: true, enum: [0, 1, 2, 3] }, // 0: Public, 1: Private, 2: Unlisted, 3: Restricted
  authorizedUsers: { type: [String], default: [] }, 
  createdOn: { type: Date, default: Date.now },
  categories: [
    {
      id: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      questions: { type: [String], required: true }, 
    },
  ],
});

studyPlanSchema.pre("save", function (next) {
  if (this.isNew && !this.authorizedUsers.includes(this.email)) {
    this.authorizedUsers.push(this.email);
  }
  next();
});

export const StudyPlans =
  mongoose.models.StudyPlans || mongoose.model("StudyPlans", studyPlanSchema);
