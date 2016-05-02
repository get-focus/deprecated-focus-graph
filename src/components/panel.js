import React, {Component} from 'react';
import Button from './button';

const FakePanelComponent = ({title, editing, toggleEdit, save, getUserInput, loading, saving, children}) => {
    const renderEditingButtons = () => (
        <div className='buttons'>
            <Button onClick={() => toggleEdit(false)}>Cancel</Button>
            <Button onClick={() => save(getUserInput())}>{'Save'}</Button>
        </div>
    );
    const renderConsultingButton = () => (
        <div className='buttons'>
            <Button onClick={() => toggleEdit(true)}>Edit</Button>
        </div>
    );
    return (
        <div className='fake-panel' data-loading={loading} data-saving={saving}>
            <div className='head'>
                <div className='title'>{title}</div>
                {editing ? renderEditingButtons() : renderConsultingButton()}
            </div>
            <div className='content'>
                {children}
            </div>
        </div>
    );
}

FakePanelComponent.displayName = 'FakePanelComponent';

export default FakePanelComponent;
