import React, { Component } from 'react';
import { Sidebar, Menu, Divider, Button, Modal, Segment, Label, Icon } from 'semantic-ui-react';
import firebase from '../firebase';
import {TwitterPicker} from 'react-color';
import { connect } from 'react-redux';
import { setColors } from '../redux/actions/setColorsAction';

class ColorPanel extends Component {
  state = {
    modal: false,
    primary: '',
    secondary: '',
    usersRef: firebase.database().ref('users'),
    userColors: [],
  };

  componentDidMount () {
      if (this.props.user) {
          this.addListener(this.props.user.currentUser.uid);
      }
  }

  addListener = userId => {
      let userColors = [];
      this.state.usersRef.child(`${userId}/colors`).on('child_added', snap => {
          userColors.unshift(snap.val());
          this.setState({ userColors });
      });
  }

  openModal = () => this.setState({modal: true});

  closeModal = () => this.setState({modal: false});

  handleChangePrimaryColor = color => {
    this.setState({primary: color.hex})
  }

  handleChangeSecondaryColor = color => {
    this.setState({secondary: color.hex})
  }

    saveColors = (primary, secondary) => {
        this.state.usersRef
        .child(`${this.props.user.currentUser.uid}/colors`)
        .push()
        .update({
            primary,
            secondary,
        })
        .then(() => {
            console.log('Colors added');
            this.closeModal();
        })
        .catch(err => console.error(err));
    };

  handleSaveColors = () => {
      if (this.state.primary && this.state.secondary) {
          this.saveColors(this.state.primary, this.state.secondary)
      }
  }

  displayUserColors = colors => colors.length > 0 && colors.map((color, i) => (
        <React.Fragment key={i}>
            <Divider/>
            <div
              className='color__container'
              onClick={() => this.props.setColors(color.primary, color.secondary)}
            >
                <div className='color__square' style={{ background: color.primary }}>
                  <div
                    className='color__overlay'
                    style={{ background: color.secondary}}
                  />
                </div>
            </div>
        </React.Fragment>
    ));

  render() {
    const { modal, primary, secondary, userColors } = this.state
    return (
      <Sidebar
      as={Menu}
      icon='labeled'
      inverted
      visible
      vertical
      width='very thin'>
      <Divider/>
      <Button icon='add' size='small' color='blue' onClick={this.openModal}/>
      {this.displayUserColors(userColors)}
      <Modal basic open={modal} onClose={this.closeModal}>
        <Modal.Header>Choose App Colors</Modal.Header>
        <Modal.Content>
          <Segment>
            <Label content='Primary Color'/>
            <TwitterPicker onChange={this.handleChangePrimaryColor} color={primary}/>
          </Segment>
          <Segment>
            <Label content='Secondary Color'/>
            <TwitterPicker onChange={this.handleChangeSecondaryColor} color={secondary}/>
          </Segment>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' inverted onClick={this.handleSaveColors}>
            <Icon name='checkmark' /> Save Color
          </Button>
          <Button color='red' inverted onClick={this.closeModal}>
            <Icon name='remove'/> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
      </Sidebar>
    );
  }
}

function mapStateToProps (state) {
    return {
        user: state.user,
    }
}

function mapDispatchToProps (dispatch) {
  return {
    setColors: function (primary, secondary) {
      dispatch(setColors(primary, secondary))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ColorPanel);