import React from 'react';
import axios from 'axios';

import {makeStyles} from '@material-ui/core/styles';

import {Button, TextField, Collapse, Typography} from '@material-ui/core';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid} from '@material-ui/core';

import {MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker} from '@material-ui/pickers';
import NumberFormat from 'react-number-format';

//Moment for standard usage (otherwise there are errors)
import moment from 'moment';
//Moment for the Date Time Picker
import MomentUtils from '@date-io/moment';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
    bottom: {
        marginBottom: theme.spacing(1),
    },
    root: {
        flexGrow: 1,
    },
    input: {
        display: "none",
    }
}));

export default function UploadInvoiceDialog(props) {
    const classes = useStyles();
    const {onClose, open} = props;

    const [title, setTitle] = React.useState("");
    const [cost, setCost] = React.useState("");
    const [selectedDate, setSelectedDate] = React.useState(moment());
    const [selectedFile, setSelectedFile] = React.useState(null);

    const { enqueueSnackbar } = useSnackbar();

    const handleClose = () => {
        onClose();
    };

    const handleOnChange = event => {
        if(event.target.id === "title") {
            console.log("Title Changed");
            setTitle(event.target.value);
        } else if(event.target.id === "cost") {
            console.log("Cost Changed");
            setCost(event.target.value);
        }
    }

    const handleDateChange = (date) => {
        setSelectedDate(date);
    }

    const onFileChange = (event) => {
        console.log(event.target.files[0]);

        if(event.target.files[0] !== undefined) {
            if(event.target.files[0].size > 40000000) {
                enqueueSnackbar(`${event.target.files[0].name} is too large. (File Size was: ${((event.target.files[0].size / 1000) / 1000).toFixed(2)}MB) (Max File Size is 40MB)`, {variant: "error"});
            } else {
                setSelectedFile(event.target.files[0]);
            }
        }
    }

    const handleSubmit = () => {
        const newInvoice = {title, cost, selectedDate, selectedFile}
        const response = createInvoice(newInvoice);

        console.log(response);

        const setMessage = (response) => {
            onClose(response.description, response.invoice, response.error);
        }

        if(response != null && typeof response.then === 'function') {
            response.then(res => {
                setMessage(res)
                console.log(res);
            });
        } else {
            setMessage(response);
        }
    }

    const createInvoice = (invoice) => {
        if(!invoice.title) {
            return {
                error: true,
                description: "No Title Provided"
            }
        } else if(!invoice.cost) {
            return {
                error: true,
                description: "No Cost Provided"
            }
        } else if(!invoice.selectedDate) {
            return {
                error: true,
                description: "No Date Provided"
            }
        } else if(!invoice.selectedDate.isValid()) {
            return {
                error: true,
                description: "Date is not valid"
            }
        } else if(invoice.selectedFile === null) {
           return {
                error: true,
                description: "No File Provided"
           }
        } else {
            const date = moment(invoice.selectedDate.format("L")).toDate();

            const form = new FormData();
            form.append("title", invoice.title);
            form.append("cost", invoice.cost);
            form.append("date", date);
            form.append("invoice", invoice.selectedFile);
            form.append("projectId", props.id);

            console.log(form);

            return axios.post('http://192.168.1.125:6969/addInvoice', form, {headers: {'Content-Type': 'application/json'}}).then(res => {
                form.append("invoiceId", res.data.invoiceId)
                form.set("date", moment(date).format("L"));

                return {
                    error: false,
                    invoice: {
                        id: form.get("invoiceId"),
                        title: form.get("title"),
                        cost: (<NumberFormat value={form.get("cost")} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} prefix={'£'} />),
                        date: form.get("date"),
                        invoice: form.get("invoice"),
                        projectId: form.get("projectId"),
                        origFile: form.get("invoice").name,
                        storedFile: res.data.storedFileName
                    },
                    description: res.data.message
                }
            }).catch(err => {
                console.error(err);

                return {
                    error: true,
                    invoice: {
                        title: form.get("title"),
                        cost: form.get("cost"),
                        date: form.get("date"),
                        invoice: form.get("invoice"),
                        projectId: form.get("projectId")
                    },
                    description: `${err.response.status} ${err.response.statusText} : ${err.response.data.message}`
                }
            });
        }
    }

    return(
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle id="loginTitle">Upload Invoice</DialogTitle>
                <DialogContent>
                <div className={classes.root}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <Grid container spacing={2} align="center" justify="space-around" className={classes.bottom}>
                            <Grid item xs={12} sm={12}>
                                <TextField autoFocus margin="dense" id="title" label="Invoice Name" type="string" fullWidth onChange={handleOnChange} />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField margin="dense" id="cost" label="Cost (£)" type="string" fullWidth multiline onChange={handleOnChange} />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <KeyboardDatePicker margin="normal" variant="inline" id="datePicker" label="Date of Invoice" format="DD/MM/yyyy" value={selectedDate} fullWidth onChange={handleDateChange}/>
                            </Grid>
                            <Grid item container direction="column" xs={12} sm={12} spacing={1}>
                                <Grid item>
                                    <Typography variant="body2">{(selectedFile !== null ? `Selected Invoice: ${selectedFile.name}` : "No Invoice Selected")}</Typography>
                                </Grid>
                                <Grid item>
                                    <input
                                        accept=".pdf"
                                        className={classes.input}
                                        id="contained-button-file"
                                        type="file"
                                        onChange={onFileChange}
                                    />
                                    <label htmlFor="contained-button-file">
                                        <Button variant="contained" color="primary" component="span">
                                        Select Invoice
                                        </Button>
                                    </label>
                                </Grid>
                            </Grid>
                        </Grid>
                    </MuiPickersUtilsProvider>
                </div>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}