import React from "react";
import axios from "axios";

import { Grid, Card, CardContent, CardActions, Typography, Button } from "@material-ui/core";

function YourProjects(props) {
    const [projList, setProjList] = React.useState([]);

    React.useEffect(() => {
        axios
        .get(
            `http://localhost:6969/userProjects?email=${localStorage.getItem(
            "email"
            )}`
        )
        .then((res) => {
            setProjList(res.data[0].Project);
        });
    }, [localStorage.getItem("email")]);

    return projList.map((project) => {
        return (
            <Grid item key={project.id} md={3} xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="h2" gutterBottom>
                            {project.name}
                        </Typography>
                        <Typography variant="body2" component="p">
                            {project.description}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="primary" href={`./project/${project.id}`}>View Project</Button>
                    </CardActions>
                </Card>
            </Grid>
        );
    });
}

export default YourProjects;
