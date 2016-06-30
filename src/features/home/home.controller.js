import ss from 'socket.io-stream';

export default class HomeController {
  constructor($rootScope, $window, io, ioStream, authToken) {

    this.host       = HOST;
    this.io         = io;
    this.$rootScope = $rootScope;
    this.$window    = $window;
    this.ioStream   = ioStream;
    this.authToken = authToken;

    this.openedChats    = {};
    this.availableChats = {};
    this.messages       = [];

    this.createChatForm = {
      visible: false,
      model: {
        caption: '',
        avatar: null
      },
      warnings: {
        caption: '',
        avatar: ''
      }
    };

    this.socket = io.connect(this.host + '/', authToken.getToken());

    // Socket inititalization
    io.on(this.socket, 'subscribed', data => {

      for (let item of data.opened)
        this.openedChats[item._id] = item;

      for (let item of data.available)
        this.availableChats[item._id] = item;

      this.setActiveChat();
    });

    // Push new chat handler
    io.on(this.socket, 'chat:created', chat => {
      this.availableChats[chat._id] = chat;
    });

    // User join handler
    io.on(this.socket, 'user:joined', data => {
      this.openedChats[data.chat].messages.push({
        text: `${data.user.name} has joined chat`,
        notification: true
      });

      this.scrollDown();
    });

    // User leave handler
    io.on(this.socket, 'user:left', data => {
      this.openedChats[data.chat].messages.push({
        text: `${data.user.name} has left chat`,
        notification: true
      });

      this.scrollDown();
    });

    // Push new message handler
    io.on(this.socket, 'message:posted', data => {
      if (this.openedChats[data.id]) {
        this.openedChats[data.id].messages.push(data.message);
        this.scrollDown();
      }
    });

    // Remove chat from available or opened array handler
    io.on(this.socket, 'chat:deleted', id => {
      if (this.availableChats[id]) {
        delete this.availableChats[id];
      } else {
        delete this.openedChats[id];
        this.setActiveChat();
      }
    });

    io.on(this.socket, 'error', err => {
      console.log(err);
    });
  }

  showCreateChatForm() {
    this.createChatForm.visible = true;
  }

  hideCreateChatForm() {
    this.createChatForm.visible = false;
    this.createChatForm.warnings = {};
    this.createChatForm.model = {};
  }

  setActiveChat(id) {
    if (!id || !this.openedChats[id]) {
      let keys = Object.keys(this.openedChats);

      if (keys.length) {
        id = keys[keys.length - 1];
      } else {
        this.activeChat = null;
        this.messages = [];
        return;
      }
    }

    this.activeChat = id;
    this.messages = this.openedChats[id].messages;
  }

  scrollDown() {
    setTimeout(() => {
      this.$window.scrollTo(0, document
        .getElementsByClassName('msgs-holder')[0]
        .offsetHeight
      );
    }, 0);
  }

  createChat() {
    let form = this.createChatForm;

    if (!form.model.avatar)
      return form.warnings.avatar = 'avatar cannot be empty';

    let writeStream = this.ioStream.createWriteStream();
    let options = {
      caption: form.model.caption,
      avatar: {
        size: form.model.avatar.size,
        name: form.model.avatar.name,
      }
    };

    let params = {
      socket: this.socket,
      eventName: 'chat:create',
      stream: writeStream,
      data: options,
      callback: result => {
        console.log(result);
        if (result.success) {
          this.openedChats[result.chat._id] = result.chat;
          this.setActiveChat(result.chat._id);
          this.hideCreateChatForm();
        } else {
          if (result.errors) {
            form.warnings = result.errors;
          } else {
            form.warnings.caption = result.msg;
          }
        }
      }
    };

    this.ioStream.emit(params);

    this.ioStream
      .createBlobReadStream(form.model.avatar)
      .pipe(writeStream);
  }

  deleteChat($event, id) {
    $event.stopPropagation();

    this.io.emit(this.socket, 'chat:delete', id, data => {
      if (data.success) {
        delete this.openedChats[id];
        this.setActiveChat();
      }
    });
  }

  joinChat($event, id) {
    $event.stopPropagation();

    this.io.emit(this.socket, 'chat:join', id, data => {
      if (data.success) {
        // Remove from available
        delete this.availableChats[data.chat._id];

        // Add to opened
        this.openedChats[data.chat._id] = data.chat;

        // Set active
        this.setActiveChat(data.chat._id);
      }
    });
  }

  leaveChat($event, id) {
    $event.stopPropagation();

    this.io.emit(this.socket, 'chat:leave', id, data => {
      if (data.success) {

        // Cut it from array of opened
        let chat = {};
        Object.assign(chat, this.openedChats[id]);
        delete this.openedChats[id];

        // And put it to array of available
        this.availableChats[chat._id] = chat;

        this.setActiveChat();
      }
    });
  }

  postMessage() {
    let data = {
      id: this.activeChat,
      text: this.message
    };

    this.io.emit(this.socket, 'chat:post', data, response => {
      if (response.success) {
        // Push message
        this.openedChats[data.id].messages.push(response.message);

        this.scrollDown();

        this.message = '';
      }
    });
  }

}

HomeController.$inject = [
  '$rootScope',
  '$window',
  'io',
  'ioStream',
  'authToken'
];