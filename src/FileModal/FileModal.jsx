import React, { Component } from 'react';
import { Modal, Input, Icon, Button } from 'semantic-ui-react';

class FileModal extends Component {
    render() {
        const {modal, closeModal} = this.props;
        return (
            <Modal open={modal} onClose={closeModal}>
                <Modal.Content>
                    <Input fluid label='File types: jpg, png' name='file' type='file'/>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='green' inverted>
                        <Icon name='checkmark'/> Send
                    </Button>
                    <Button color='red' inverted onClick={closeModal}>
                        <Icon name='remove'/> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

export default FileModal;