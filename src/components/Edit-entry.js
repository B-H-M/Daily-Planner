import React, { Component } from 'react'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

export default class EditEntry extends Component {
    constructor(props) {
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeTask = this.onChangeTask.bind(this);
        this.onChangePriority = this.onChangePriority.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            username: '',
            task: '',
            priority: '',
            date: new Date(),
            users: []
        }
    }

    componentDidMount() {
        axios.get('http://localhost:4500/entries/'+this.props.match.params.id)
            .then(res => {
                this.setState({
                    username: res.data.username,
                    task: res.data.task,
                    priority: res.data.priority,
                    date: new Date(res.data.date)                       
                })                
            })
            .catch(function(error) {
                console.log(error)
            })

        axios.get('http://localhost:4500/users')
            .then(res => {
                if(res.data.length > 0) {
                    this.setState({
                        users: res.data.map(user => user.username),
                        username: res.data[0].username
                    })
                }
            })
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        })
    }

    onChangeTask(e) {
        this.setState({
            task: e.target.value
        })
    }

    onChangePriority(e) {
        this.setState({
            priority: e.target.value
        })
    }

    onChangeDate(date) {
        this.setState({
            date: date
        })
    }

    onSubmit(e) {
        e.preventDefault();

        const entry = {
            username: this.state.username,
            task: this.state.task,
            priority: this.state.priority,
            date: this.state.date
        }
        
        console.log(entry);

        

        axios.post('http://localhost:4500/entries/update/'+this.props.match.params.id, entry)
            .then(res => console.log(res.data))

        window.location = '/';
    }
    render(){
        return (
            <div>
                <h3 className="mt-5">Edit Entry Log</h3>
                <form onSubmit = {this.onSubmit}>
                    <div className="form-group">
                        <label>Username: </label>
                        <select ref="userInput" required className="form-control"
                        value={this.state.username} 
                        onChange={this.onChangeUsername} >
                            {
                                this.state.users.map(user => {
                                    return <option key={user} value={user} >
                                        {user}
                                    </option>
                                })
                            }
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Task: </label>
                        <input type="text" required className="form-control"
                        value={this.state.task}
                        onChange={this.onChangeTask} />
                    </div>

                    <div className="form-group">
                        <label>Priority: </label>
                        <input type={"text"} required className="form-control"
                        value={this.state.priority}
                        onChange={this.onChangePriority} />
                    </div>

                    <div className="form-group">
                        <label>Date: </label>
                        <div>
                            <DatePicker
                            selected={this.state.date}
                            onChange={this.state.onChangeDate} />
                        </div>
                    </div>

                    <div className="form-group">
                            <input type="submit" value="Edit Entry Log" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )

    }
}
