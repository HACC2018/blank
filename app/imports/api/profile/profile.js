import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';
// import { Meteor } from 'meteor/meteor';

/** Create a Meteor collection. */
const Profiles = new Mongo.Collection('Profiles');
// const username = Meteor.users.findOne(this.userId).username;

/** Create a schema to constrain the structure of documents associated with this collection. */
const ProfileSchema = new SimpleSchema({
  firstName: String,
  middleName: { type: String, optional: true },
  lastName: String,
  gender: { type: String, allowedValues: ['Select', 'Male', 'Female', 'Other'] },
  employmentStatus: { type: String, allowedValues: ['Select', 'Employed', 'Unemployed', 'Seeking Work'] },
  image: { type: String, optional: true },
  biography: { type: String, optional: true },
  street: { type: String, optional: true },
  city: { type: String, optional: true },
  state: { type: String },
  zipCode: { type: Number, optional: true },
  phoneNumber: { type: String, optional: true },
  contactEmail: { type: String, defaultValue: '' },
  goals: { type: String, optional: true },
  academicCredentials: { type: String, optional: true },
  pedagogy: { type: String, optional: true },
  interests: { type: String, optional: true },
  owner: { type: String },
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Profiles.attachSchema(ProfileSchema);

/** Make the collection and schema available to other code. */
export { Profiles, ProfileSchema };
