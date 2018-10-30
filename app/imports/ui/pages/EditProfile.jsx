import React from 'react';
import { Grid, Loader, Header } from 'semantic-ui-react';
import { Profiles, ProfileSchema } from '/imports/api/profile/profile';
import { Bert } from 'meteor/themeteorchef:bert';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import HiddenField from 'uniforms-semantic/HiddenField';
// import RadioField from 'uniforms-semantic/RadioField';
// import BoolField from 'uniforms-semantic/BoolField';
import SelectField from 'uniforms-semantic/SelectField';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

/** Renders the Page for editing a single document. */
class EditProfile extends React.Component {

  /** Bind 'this' so that a ref to the Form can be saved in formRef and communicated between render() and submit(). */
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.insertCallback = this.insertCallback.bind(this);
    this.username = null;
    this.getUsername = this.getUsername.bind(this);
    console.log(this.username);
  }

  getUsername() {
    this.username = Meteor.user().username;
    return Meteor.user().username;
    // console.log(this.username);
  }

  /** Notify the user of the results of the submit. If successful, clear the form. */
  insertCallback(error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Profile update failed: ${error.message}` });
    } else {
      Bert.alert({ type: 'success', message: 'Profile update succeeded' });
    }
  }

  createProfile(data) {
    const {
      firstName, middleName, lastName, gender, employmentStatus, image,
      street, city, state, zipCode, phoneNumber, contactEmail, academicCredentials, goals, biography,
    } = data;
    const owner = Meteor.user().username;
    Profiles.insert({
      firstName,
      middleName,
      lastName,
      gender,
      employmentStatus,
      image,
      street,
      city,
      state,
      zipCode,
      phoneNumber,
      contactEmail,
      academicCredentials,
      goals,
      biography,
      owner,
    }, this.insertCallback(this.error));
  }

  updateProfile(data) {
    const {
      firstName, middleName, lastName, gender, employmentStatus, image,
      street, city, state, zipCode, phoneNumber, contactEmail, academicCredentials, goals, biography, _id,
    } = data;
    Profiles.set(_id, {
      $set: {
        firstName,
        middleName,
        lastName,
        gender,
        employmentStatus,
        image,
        street,
        city,
        state,
        zipCode,
        phoneNumber,
        contactEmail,
        academicCredentials,
        goals,
        biography,
      },
    }, this.insertCallback(this.error));
  }

  /** On successful submit, insert the data. */
  submit(data) {
    if (Profiles.find().count() === 0) {
      this.createProfile(data);
    } else {
      this.updateProfile(data);
    }
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Edit Profile</Header>
            <AutoForm schema={ProfileSchema} onSubmit={this.submit} model={this.props.doc}>
              <Grid stackable>

                <Grid.Row>
                  <Header as='h3'>General Information</Header>
                </Grid.Row>
                <Grid.Row columns='equal'>
                  <Grid.Column>
                    <TextField name='firstName'/>
                  </Grid.Column>
                  <Grid.Column>
                    <TextField name='middleName'/>
                  </Grid.Column>
                  <Grid.Column>
                    <TextField name='lastName'/>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns='equal'>
                  <Grid.Column>
                    <SelectField name='gender'/>
                  </Grid.Column>
                  <Grid.Column>
                    <SelectField name='employmentStatus'/>
                  </Grid.Column>
                  <Grid.Column>
                    <TextField name='image' placeholder='Paste url to image'/>
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Header as='h3'>Contact Information</Header>
                </Grid.Row>
                <Grid.Row columns='equal'>
                  <Grid.Column width={8}>
                    <TextField name='street'/>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <TextField name='city'/>
                  </Grid.Column>
                  <Grid.Column>
                    <TextField name='state'/>
                  </Grid.Column>
                  <Grid.Column>
                    <TextField name='zipCode'/>
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row columns={2}>
                  <Grid.Column>
                    <TextField name='phoneNumber'/>
                  </Grid.Column>
                  <Grid.Column>
                    <TextField name='contactEmail'/>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <Header as='h3'>Additional Information</Header>
              <TextField name='academicCredentials' placeholder='i.e., M.Ed., The University of Hawaii at Manoa, 2000'/>
              <LongTextField name='goals'/>
              <LongTextField name='biography' placeholder='Any additional information you would like to include'/>
              <SubmitField value='Submit'/>
              <ErrorsField/>
              <HiddenField name='owner' value='fakeuser@foo.com'/>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

/** Require the presence of a Contact document in the props object. Uniforms adds 'model' to the props, which we use. */
EditProfile.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  // Get access to Contact documents.
  const subscription = Meteor.subscribe('Profiles');
  // const username = Meteor.users.findOne(this.userId).username;
  // const username = this.getUsername;
  // console.log(this.username, username);
  return {
    doc: Profiles.findOne(documentId),
    // doc: Profiles.findOne({ owner: username }),
  // doc: Profiles.findOne({ owner: Meteor.users.findOne(this.userId).username }),
    ready: subscription.ready(),
  };
})(EditProfile);
