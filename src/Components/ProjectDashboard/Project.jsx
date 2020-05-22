import React from "react";
import axios from "axios";

import {useParams, Redirect} from "react-router-dom";

import {Box, Typography, Grid, Tabs, Tab } from "@material-ui/core";
import {createMuiTheme, responsiveFontSizes, ThemeProvider} from '@material-ui/core/styles';
import { makeStyles } from "@material-ui/styles";

import Overview from './Overview';
import Meetings from './Meetings';
import Deadlines from './Deadlines';
import Invoices from './Invoices';


const useStyles = makeStyles({
    title: {
        marginTop: 0,
    }
});

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-auto-tabpanel-${index}`}
        aria-labelledby={`scrollable-auto-tab-${index}`}
        {...other}
      >
        {value === index && <Box p={3}>{children}</Box>}
      </Typography>
    );
}

export default function Project(props) {
    const [project, setProject] = React.useState({});
    const [tab, setTab] = React.useState(0);

    const classes = useStyles();

    let {id} = useParams();

    React.useEffect(() => {
        axios.get(`http://192.168.1.125:6969/getProject?id=${id}`).then(res => {    
            setProject(res.data);
        });
    }, [id]);

    const handleChange = (event, newValue) => {
        setTab(newValue);
    }

    if(localStorage.getItem('email') === null) {
        return(
            <Redirect to={{
                pathname: "/dashboard",
                state: { error: `You need to be logged in to view this page!`}
            }}/>
        );
    }

    if(project === "") {
        return(
            <Redirect to={{
                pathname: "/dashboard",
                state: { error: `Project ${id} was not found`}
            }}/>
        );
    }

    return (
        <React.Fragment>
            <Grid container spacing={4} className={classes.title}>
                <Grid item sm={12} xs={12}>
                    <Typography variant="h1">{project.name}</Typography>
                    <Typography variant="h2" color="textSecondary">{project.description}</Typography>
                </Grid>
                <Grid item md={12} xs={12}>
                    <Tabs value={tab} onChange={handleChange} indicatorColor="primary" textColor="primary" variant="scrollable">
                        <Tab label="Overview"/>
                        <Tab label="Meetings"/>
                        <Tab label="Deadlines"/>
                        <Tab label="Members"/>
                        <Tab label="Devices"/>
                        <Tab label="Invoices"/>
                    </Tabs>
                </Grid>
                <Grid item md={12} xs={12}>
                    <TabPanel value={tab} index={0}><Overview id={project.id}/></TabPanel>
                    <TabPanel value={tab} index={1}><Meetings id={project.id}/></TabPanel>
                    <TabPanel value={tab} index={2}><Deadlines id={project.id}/></TabPanel>
                    <TabPanel value={tab} index={3}>Members</TabPanel>
                    <TabPanel value={tab} index={4}>Devices</TabPanel>
                    <TabPanel value={tab} index={5}><Invoices id={project.id}/></TabPanel>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}