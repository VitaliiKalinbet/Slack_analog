import React, { Component } from 'react';
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Button, Modal, Input } from 'semantic-ui-react';
import firebase from '../firebase';
import AvatarEditor from 'react-avatar-editor';

class UserPanel extends Component {

    state = {
        modal: false,
        previewImage: '',
        croppedImage: '',
        blob: '',
        uploadedCroppedImage: "",
        storageRef: firebase.storage().ref(),
        userRef: firebase.auth().currentUser,
        usersRef: firebase.database().ref("users"),
        metadata: {
            contentType: "image/jpeg"
        }
    }

    dropdownOptions = () => [
        {
            key: 'user',
            text: <span>Signed in as <strong>User</strong></span>,
            disabled: true,
        },
        {
            key: 'avatar',
            text: <span onClick={this.openModal}><Icon name='picture'/>Change Avatar</span>
        },
        {
            key: 'out',
            text: <span onClick={this.signOut}><Icon name='sign-out'/>Sign Out</span>
        }
    ];

    signOut = () => {
        firebase
        .auth()
        .signOut()
        .then(() => {
            console.log('signed out');
        })
    }

    openModal = () => this.setState({ modal: true });
    closeModal = () => this.setState({ modal: false });

    handlerChange = event => {
        const file = event.target.files[0];
        const reader = new FileReader();

        if (file) {
            reader.readAsDataURL(file);
            reader.addEventListener('load', () => {
                this.setState({ previewImage: reader.result });
            });
        }
    };

    handlerCropImage = () => {
        if (this.avatarEditor) {
            this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
                let imageUrl = URL.createObjectURL(blob);
                this.setState({
                    croppedImage: imageUrl,
                    blob
                });
            });
        }
    }

    uploadCroppedImage = () => {
        const { storageRef, userRef, blob, metadata } = this.state;
        storageRef
          .child(`avatars/user-${userRef.uid}`)
          .put(blob, metadata)
          .then(snap => {
            snap.ref.getDownloadURL().then(downloadURL => {
              this.setState({ uploadedCroppedImage: downloadURL }, () =>
                this.changeAvatar()
              );
            });
          });
      };

      changeAvatar = () => {
        this.state.userRef
          .updateProfile({
            photoURL: this.state.uploadedCroppedImage
          })
          .then(() => {
            console.log("PhotoURL updated");
            this.closeModal();
          })
          .catch(err => {
            console.error(err);
          });
        this.state.usersRef
          .child(this.props.user.uid)
          .update({ avatar: this.state.uploadedCroppedImage })
          .then(() => {
            console.log("User avatar updated");
          })
          .catch(err => {
            console.error(err);
          });
      };

    // uploadedCroppedImage = () => {
    //     const { storageRef, userRef, blob, metadata } = this.state;

    //     storageRef
    //         .child(`avatars/user-${userRef.uid}`)
    //         .put(blob, metadata)
    //         .then(snap => {
    //             snap.ref.getDownloadURL().then(getDownloadURL => {
    //                 this.setState({ uploadedCroppedImage: getDownloadURL }, () => this.changeAvatar()
    //                 );
    //             });
    //         });
    // }

    // changeAvatar = () => {
    //     this.state.userRef
    //         .updateProfile({
    //             photoURL: this.uploadedCroppedImage
    //         })
    //         .then(() => {
    //             console.log('PhotoURL updated');
    //             this.closeModal();
    //         })
    //         .catch(err => {
    //             console.error(err);
    //         })

    //     this.state.usersRef
    //         .child(this.props.user.uid)
    //         .update({ avatar: this.state.uploadedCroppedImage })
    //         .then(() => {
    //             console.log('User avatar update');
    //         })
    //         .catch(err => {
    //             console.error(err);
    //         });
    // };

    render() {
        return (
            <Grid style={{
                backround: this.props.color.primaryColor,
            }}>
                <Grid.Column>
                    <Grid.Row
                        style={{
                            padding: '1.2rem',
                            margin: '0'
                        }}>
                            <Header inverted floated='left' as='h2'>
                                <Icon name='cloud'/>
                                <Header.Content>Slack clone</Header.Content>
                            </Header>
                        {/* user dropdown */}
                        <Header style={{padding: '0.25rem'}} as='h4' inverted>
                            <Dropdown trigger={
                                <span style={{marginLeft: '1rem'}}><Image src={this.props.user.photoURL} spaced='right' avatar/>{this.props.user.displayName}</span>
                            } options={this.dropdownOptions()}/>
                        </Header>
                    </Grid.Row>
                    <Modal open={this.state.modal} onClose={this.closeModal}>
                        <Modal.Header>Change Avatar</Modal.Header>
                        <Modal.Content>
                        <Input onChange={this.handlerChange} fluid type="file" label="New Avatar" name="previewImage" />
                        <Grid centered stackable columns={2}>
                            <Grid.Row centered>
                            <Grid.Column className="ui center aligned grid">
                                {/* Image Preview */}
                                {this.state.previewImage && (
                                    <AvatarEditor
                                        ref={node => (this.avatarEditor = node)}
                                        image={this.state.previewImage}
                                        width={120}
                                        height={120}
                                        border={50}
                                        scale={1.2}
                                    />
                                )}
                            </Grid.Column>
                            <Grid.Column>{/* Cropped Image Preview */}
                            {this.state.croppedImage && (
                                <Image
                                    style={{ margin: '3.5em auto' }}
                                    width={100}
                                    height={100}
                                    src={this.state.croppedImage}
                                />
                            )}
                            </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        </Modal.Content>
                        <Modal.Actions>
                        <Button onClick={this.uploadCroppedImage} color="green" inverted>
                            <Icon name="save" /> Change Avatar
                        </Button>
                        <Button onClick={this.handlerCropImage} color="green" inverted>
                            <Icon name="image" /> Preview
                        </Button>
                        <Button color="red" inverted onClick={this.closeModal}>
                            <Icon name="remove" /> Cancel
                        </Button>
                        </Modal.Actions>
                    </Modal>
                </Grid.Column>
            </Grid>
        );
    }
}

function mapStateToProps (state) {
    return {
        user: state.user.currentUser,
        color: state.color,
    }
}

export default connect(mapStateToProps)(UserPanel);