import React, {useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import {Button} from "@material-ui/core";
import {connect} from "react-redux";
import * as PropTypes from "prop-types";
import axios from "../../axios";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyle = makeStyles((theme) => ({
    button: {
        float: "right",
        width: "fit-content",
        alignSelf: "flex-end"
    },
}))

const SubCategoryModal = ({onClose, category}) => {
    const classes = useStyle()
    const [subCategory, setSubCategory] = useState('')
    const [open, setOpen] = useState(false)
    const addNewSubCategory = (e) => {
        e.preventDefault()
        let body = new FormData()
        body.append("name", subCategory);
        body.append("category_id", category.id);
        axios.post('/category/subcategory', body).then(subCategoryResponse => {
            if (subCategoryResponse.status === 200) {
                setOpen(false)
                onClose()
            }
        })
    }

    return (<div>
            <Button
                className={classes.button}
                variant='contained'
                color="primary"
                onClick={e => {
                    e.preventDefault()
                    setOpen(true)
                }}
                key={`button-${category.id}`}
            >
                Add Sub-Category
            </Button>
            <Dialog
                open={open}
                onClose={() => {
                    onClose()
                }}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <DialogTitle id="form-dialog-title">Add New
                    SubCategory</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter Name of New Sub-Category for {category.name}
                    </DialogContentText>
                    <TextField
                        value={subCategory}
                        onChange={e => setSubCategory(e.target.value)}
                        autoFocus
                        margin="dense"
                        id="subCategory"
                        label="Sub-Category"
                        type="sub-category"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpen(false)
                        onClose()
                    }}
                            color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={addNewSubCategory}
                            variant="contained" color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
SubCategoryModal.prototype = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
};
const mapStateToProps = (state) => ({
    user: state.user
})

export default connect(mapStateToProps, null)(React.memo(SubCategoryModal))
