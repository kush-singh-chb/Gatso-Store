import React from 'react';
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Image from '../../img/product.png'
import { Button, Card, CardMedia, Grid, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
    ...theme.spreadThis,
    root: {
        display: "flex",
        padding: "8px"
    },
    product__img: {
        height: "64px",
        width: "64px"
    },
    deleteBtn: {
        cursor: "pointer",
        width: "40px",
        height: "40px",
        marginTop: "8px"
    }
})
);

function PopProduct({ id, name, price, image }) {
    const classes = useStyles();
    const theme = useTheme();
    return (
        <div>
            <Card className={classes.root}>
                <CardMedia
                    component="img"
                    className={classes.product__img}
                    image={Image}
                    title="Sample Product"
                />
                <Grid div spacing={0.5}>
                    <Grid item xs={8}>
                        Product Name
                    </Grid>
                    <Grid container spacing={0.5}>
                        <Grid item xs={6}>
                            €5.00
                    </Grid>
                        <Grid item xs={6}>
                            x2
                    </Grid>
                    </Grid>
                </Grid>
                <IconButton className={classes.deleteBtn} aria-label="delete">
                    <DeleteIcon />
                </IconButton>
            </Card>
        </div>
    )
}

export default PopProduct
