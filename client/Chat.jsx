import React from 'react';
import {Message, botReceiveMessage} from './index';
import {db} from '../fire'

//export default () => <Chat room={db.collection('test-chat')}/>
//props: room

export default class Chat extends React.Component {
    constructor(){
        super();
        this.state = {
            messages: [],
            showChat: false,
            newMessage: ''
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleBot = this.handleBot.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    componentDidMount() {
        this.props.room.orderBy('time').onSnapshot((snapshot) => {
            this.setState({messages: snapshot.docs});
        });
        this.el && this.scrollToBottom();
    }

    componentDidUpdate() {
        this.el && this.scrollToBottom();
    }

    scrollToBottom() {
        this.el.scrollIntoView({ behaviour: 'smooth' });
    }

    handleClick(evt) {
        evt.preventDefault();
        this.setState({showChat: !this.state.showChat});
    }

    handleBot(evt){
        evt.preventDefault();
        this.handleSubmit(evt);
        botReceiveMessage(this.state.newMessage, this.props.room);
    }

    handleChange(evt) {
        this.setState({newMessage: evt.target.value});
    }

    handleSubmit(evt) {
        evt.preventDefault();
        this.setState({ newMessage: '' });
        this.props.room.add({
             time: new Date(),
             text: this.state.newMessage,
             from: this.props.user.displayName
         });
    }

    render() {
        // console.log("this.sdkfnsfjkskjfs", this.props.numOfUsers)
        return (
            this.state.showChat
                ? (
                    <form className="chatForm" onSubmit={this.handleSubmit}>
                    <div className="chatTitle">😀 {this.props.numOfUsers}
                    </div>
                        <div className="chatMessage" >
                            {this.state.messages.map((message, index) => {
                                return <Message key={index} data={message.data()} {...message.data()} />;
                            })}
                            <div ref={el => { this.el = el; }}>
                                <input type="text" value={this.state.newMessage} onChange={this.handleChange} />
                                <button className="btn waves-effect waves-light" type="submit" name="action">Submit
                                <i className="material-icons right">send</i>
                              </button>

                                <a className="toggleChat" onClick={this.handleClick}><i className="material-icons right">chat_button</i></a>
                            </div>
                        </div>
                    </form>
                    )
                : (
                    <a className="toggleChat" onClick={this.handleClick}><i className="material-icons right">chat_bubble_outline</i></a>
                    )
        );
    }
}


// <button class="btn waves-effect waves-light" type="submit" name="action">Submit
// <i class="material-icons right">send</i>
// </button>

// <button className='bot' onClick={this.handleBot} >Bot</button> removing as we are not using a bot button

//<a class="btn-floating btn-large waves-effect waves-light red"><i class="material-icons">add</i></a>
//<input type="submit" />

//<button className="toggleChat fa fa-commenting-o" onClick={this.handleClick} />
