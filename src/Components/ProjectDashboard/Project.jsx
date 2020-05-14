import React from "react";
import axios from "axios";

import {useParams} from "react-router-dom";

import {Box, Typography, Grid, Tabs, Tab } from "@material-ui/core";
import {makeStyles, createMuiTheme, responsiveFontSizes, ThemeProvider} from '@material-ui/core/styles';

import Overview from './Overview';

let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

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

    let {id} = useParams();

    React.useEffect(() => {
        axios.get(`http://localhost:6969/getProject?id=${id}`).then(res => {
            setProject(res.data);
        })
    }, [id]);

    const handleChange = (event, newValue) => {
        setTab(newValue);
    }

    return (
        <ThemeProvider theme={theme}>
            <Grid container spacing={4}>
                <Grid item sm={12} xs={12}>
                    <Typography variant="h1">{project.name}</Typography>
                    <Typography variant="h2" color="textSecondary">{project.description}</Typography>
                </Grid>
                <Grid item md={12} sm={12}>
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
                    <TabPanel value={tab} index={0}><Overview/></TabPanel>
                    <TabPanel value={tab} index={1}>Meetings</TabPanel>
                    <TabPanel value={tab} index={2}>Deadlines</TabPanel>
                    <TabPanel value={tab} index={3}>Members</TabPanel>
                    <TabPanel value={tab} index={4}>Devices</TabPanel>
                    <TabPanel value={tab} index={5}>Invoices</TabPanel>
                </Grid>
            </Grid>
        </ThemeProvider>
        
    )
}