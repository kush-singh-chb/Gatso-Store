import {makeStyles} from '@material-ui/core/styles';
import {Button} from '@material-ui/core'
import React, {useCallback, useEffect, useState} from 'react'
import {connect} from 'react-redux'
import ListSubheader from "@material-ui/core/ListSubheader";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccordionSummary from "@material-ui/core/AccordionSummary";
import List from "@material-ui/core/List";
import axios from "../../axios";
import NewCategoryModal from "./NewCategoryModal"
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import SubCategoryModal from "./SubCategoryModal";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: "column"
    },
    title: {
        width: "100%",
    },
    button: {
        float: "right",
        width: "fit-content",
        alignSelf: "flex-end"
    },
    sublistHeader: {
        fontWeight: "600",
        color: "black"
    },
    subCategoryList: {
        display: "flex",
        flexDirection: "column"
    },
    categoryDiv: {
        marginTop: theme.spacing(2)
    }
}))


export const VendorCategory = ({setShowProgress, user}) => {
    const classes = useStyles()
    const [openCategoryModal, setOpenCategoryModal] = useState(false)
    const [category, setCategory] = useState([])

    const getData = useCallback(() => {
        let tableData = []
        let bodyData = new FormData()
        bodyData.append("vendor", user["back_id"])
        setShowProgress(true)
        axios.get('/category', {params: bodyData}).then(categoryResponse => {
            tableData = JSON.parse(JSON.stringify(categoryResponse.data))
            setCategory(tableData)
            tableData.forEach((category, p_index) => {
                let body = new FormData()
                body.append('category_id', category.id)
                axios.get('/category/subcategory', {params: body}).then(subResponse => {
                    subResponse.data.forEach((value, index) => {
                        if (value.category_id === category.id) {
                            if (tableData[p_index].subcategory === undefined) {
                                tableData[p_index].subcategory = []
                            }
                            tableData[p_index].subcategory.push(value)
                            setCategory((tableData) => [...tableData])
                            setShowProgress(false)
                        }
                    })
                }).catch(err=>{
                    setShowProgress(false)
                })
            })
        })
    }, [user,setShowProgress])

    useEffect(() => {
            getData()
            return () => {
                console.log("re-render")
            }
        }, [setCategory, user, getData]
    )


    return (
        <div className={classes.root}>

            <h3 className={classes.title}>Vendor Category</h3>

            <Button
                className={classes.button}
                variant='contained'
                color="primary"
                onClick={() => setOpenCategoryModal(true)}
            >
                Add Category
            </Button>
            <NewCategoryModal key={`dialogNext`}
                              open={openCategoryModal}
                              onClose={() => {
                                  setOpenCategoryModal(false)
                                  getData()
                              }}
                              category={category}
            />
            <div className={classes.categoryDiv}>

                {Array.from(category).map((p_value, index) => {
                    return (
                        <List key={`list${p_value.id}`}>
                            <Accordion key={p_value.id} mt={2}>
                                <AccordionSummary
                                    key={`summary-${p_value.id}`}
                                    expandIcon={<ExpandMoreIcon/>}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <ListSubheader key={`sublistHeader-${p_value.id}`}
                                                   className={classes.sublistHeader}
                                                   component="div"
                                                   id="nested-list-subheader">
                                        {p_value.name}
                                    </ListSubheader>
                                </AccordionSummary>

                                <AccordionDetails key={`accordionDetails-${p_value.id}`}
                                                  className={classes.subCategoryList}>
                                    <SubCategoryModal
                                    onClose={()=>{
                                        getData()
                                    }}
                                    category={p_value}/>
                                    <List>
                                        {(p_value.subcategory !== undefined) && Array.from(p_value.subcategory).map(subValue => {
                                            return (<ListItem button key={`li${subValue.id}`}>
                                                <ListItemText key={`txt${subValue.id}`} inset
                                                              primary={subValue.name}/>
                                            </ListItem>)
                                        })}
                                    </List>
                                </AccordionDetails>
                            </Accordion>
                        </List>)

                })
                }

            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(VendorCategory)
