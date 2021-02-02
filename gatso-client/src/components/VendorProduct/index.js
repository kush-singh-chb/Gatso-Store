import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Button } from '@material-ui/core'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import axios from "../../axios"
import { auth } from '../../firebase'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
}))

export const VendorProduct = ({ setShowProgess, user }) => {
    const classes = useStyles()
    useEffect(async () => {
        // axios.get(`/product`, {
        //     params: {
        //         vendor: `${user['back_id']}`
        //     }
        // }).then(response => {
        //     console.log(response.data)
        //     setShowProgess(false)
        // })

    }, [setShowProgess])
    return (
        <div>
            <p>Vendor Product</p>
            <Button className={classes}></Button>
        </div>
    )
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(VendorProduct)
