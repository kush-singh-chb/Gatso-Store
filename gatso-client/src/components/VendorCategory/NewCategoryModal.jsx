import React, {useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import {Button} from "@material-ui/core";
import * as PropTypes from "prop-types";
import {connect} from "react-redux";
import axios from "../../axios";


const NewCategoryModal = ({open, onClose, user}) => {
    const [newCategoryTxt, setNewCategoryTxt] = useState('')
    const addNewCategory = () => {
        let bodyData = new FormData()
        bodyData.append("name", newCategoryTxt)
        bodyData.append("vendor", user["back_id"])
        axios.post("/category", bodyData).then(categoryResponse => {
            if (categoryResponse.status === 200) {
                onClose()
            }

        })
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"

        >
            <DialogTitle id="form-dialog-title">Add New
                Category</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter Name of New Category
                </DialogContentText>
                <TextField

                    autoFocus
                    value={newCategoryTxt}
                    margin="dense"
                    id="Category"
                    label="Category"
                    type="category"
                    onChange={e => setNewCategoryTxt(e.target.value)}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}
                        color="secondary">
                    Cancel
                </Button>
                <Button onClick={addNewCategory}
                        variant="contained" color="primary">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    )
}

NewCategoryModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    value: PropTypes.string,
    onClick: PropTypes.func
};


const mapStateToProps = (state) => ({
    user: state.user
});

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(NewCategoryModal)