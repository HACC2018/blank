import { Meteor } from 'meteor/meteor';
import { Profiles } from '../../api/profile/profile.js';

/** Initialize the database with a default data document. */
function addData(data) {
  console.log(`  Adding: ${data.lastName} (${data.owner})`);
  Profiles.insert(data);
}

/** Initialize the collection if empty. */
if (Profiles.find().count() === 0) {
  if (Meteor.settings.defaultProfile) {
    console.log('Creating default contacts.');
    Meteor.settings.defaultProfile.map(data => addData(data));
  }
}

/** This subscription publishes only the documents associated with the logged in user */
Meteor.publish('Profiles', function publish() {
  if (this.userId) {
    // const username = Meteor.users.findOne(this.userId).username;
    return Profiles.find();
  }
  return this.ready();
});
