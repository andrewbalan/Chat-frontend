export default class HomeController {
  constructor($rootScope, $window, chat, io, authToken) {

    this.$rootScope = $rootScope;
    this.$window    = $window;
    this.chat       = chat;
    this.io         = io;
    this.authToken  = authToken;

    this.openedChats    = [];
    this.availableChats = [];
    this.messages       = [];

    this.createChatForm = {
      visible: false,
      model: {
        caption: ''
      },
      warnings: {
        caption: ''
      }
    }

    let socket = io.connect('http://localhost:3000', authToken.getToken());
    this.socket = socket;

    // Socket inititalization
    io.on(this.socket, 'subscribed', data => {
      this.openedChats = data.opened;
      this.availableChats = data.available;

      let length = this.openedChats.length;
      if(length) {
        this.setActiveChat(this.openedChats[length - 1]._id);
      }
    });

    // Push new chat
    io.on(this.socket, 'chat:created', chat => {
      this.availableChats.push(chat);
    });

    // Push new message
    io.on(this.socket, 'message:posted', data => {
      for(let i in this.openedChats)
        if(this.openedChats[i]._id === data.id) {
          this.openedChats[i].messages.push(data.message);

          // Scroll page down
          setTimeout(() => {
            this.$window.scrollTo(0 ,document
              .getElementsByClassName('msgs-holder')[0]
              .offsetHeight
            );
          }, 0);
        }
    });

    // Remove chat from available or opened arrays
    io.on(this.socket, 'chat:deleted', id => {
      for(let i in this.availableChats)
        if(this.availableChats[i]._id === id) {
          this.availableChats.splice(i,1);
          return;
        }

      for(let i in this.openedChats)
        if(this.openedChats[i]._id === id) {
          this.openedChats.splice(i,1);
          // Set other active chat
          if (this.openedChats[0])
            this.setActiveChat(this.openedChats[0]._id);
          return;
        }
    });

    // TO REFACTOR: IMPLEMENT SOME ERROR HANDLING
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
    this.activeChat = id;

    // to refactor
    for (let i in this.openedChats)
      if(this.openedChats[i]._id === id)
        return this.messages = this.openedChats[i].messages;
  }

  createChat() {
    let form = this.createChatForm;

    this.io.emit(this.socket, 'chat:create', form.model.caption,
      data => {
        if(data.success) {
          this.openedChats.push(data.chat);
          this.setActiveChat(data.chat._id);
          this.hideCreateChatForm();
        } else {
          form.warnings.caption = data.msg;
        }
      }
    );
  }

  deleteChat($event, id) {
    $event.stopPropagation();

    this.io.emit(this.socket, 'chat:delete', id, data => {
      if(data.success) {
        // Removing chat from list of opened chats
        for(let i in this.openedChats)
          if(this.openedChats[i]._id === id) {
            this.openedChats.splice(i,1);
            break;
          }

        if(this.openedChats[0])
          this.setActiveChat(this.openedChats[0]._id);
      }
    });
  }

  joinChat($event, id) {
    $event.stopPropagation();

    this.io.emit(this.socket, 'chat:join', id, data => {
      if(data.success) {

        // Add to opened
        this.openedChats.push(data.chat);

        // Remove from available
        for(let i in this.availableChats)
          if(this.availableChats[i]._id === id) {
            this.availableChats.splice(i,1);
            break;
          }

        // Set active
        this.setActiveChat(data.chat._id);
      }
    });
  }

  leaveChat($event, id) {
    $event.stopPropagation();

    this.io.emit(this.socket, 'chat:leave', id, data => {
      if(data.success) {
        let chat;

        // Remove from opened
        for(let i in this.openedChats)
          if(this.openedChats[i]._id === id) {
            chat = this.openedChats.splice(i,1)[0];
            break;
          }

        // Add to available
        this.availableChats.push(chat);

        // Set active
        if(this.openedChats[0])
          this.setActiveChat(this.openedChats[0]._id);
      }
    });
  }

  postMessage() {
    let data = {
      id: this.activeChat,
      text: this.message
    };

    this.io.emit(this.socket, 'chat:post', data, response => {
      if(response.success) {
        // Push message
        for(let i in this.openedChats)
          if(this.openedChats[i]._id === data.id) {
            this.openedChats[i].messages.push(response.message);
            break;
          }

        // Scroll page down
        setTimeout(() => {
          this.$window.scrollTo(0 ,document
            .getElementsByClassName('msgs-holder')[0]
            .offsetHeight
          );
        }, 0);

        this.message = '';
      } else {
        // TO REFACTOR: IMPLEMENT SOME ERROR HANDLING
        console.log(response);
      }
    });
  }

}

HomeController.$inject = [
  '$rootScope',
  '$window',
  'chat',
  'io',
  'authToken'
];