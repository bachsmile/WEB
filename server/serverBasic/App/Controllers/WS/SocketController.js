module.exports = (io) => {
    const usernames = [];

    io.on('connection', function(socket){
        console.log('A new user connected');

        socket.on('adduser', (username) => {
            socket.username = username;
            usernames.push(username);

            const data = {
                sender: 'SERVER',
                message: 'You have join chat room'
            };

            socket.emit('update_message', data);

            const data2 = {
                sender: 'SERVER',
                message: username + ' has join chat room'
            }

            socket.broadcast.emit('update_message', data2);
        });

        socket.on('send_message', (message) => {
            console.log('a')
            const data = {
                sender: 'YOU',
                message: message
            };

            socket.emit('update_message', data);

            const data2 = {
                sender: socket.username,
                message: message
            };

            socket.broadcast.emit('update_message', data2);
        });

        socket.on('disconnect', () => {

            for(let i = 0; i < usernames.length; i++){
                if(usernames[i] == socket.username){
                    usernames.splice(i, 1);
                }
            };

            const data = {
                sender: 'SERVER',
                message: socket.username + ' has left chat room'
            };

            socket.broadcast.emit('update_message', data);
        });

        socket.on('getClient', () => {

            // const data = {
            //     sender: 'YOU',
            //     message: message
            // };

            // socket.emit('update_message', data);

            // const data2 = {
            //     sender: socket.username,
            //     message: message
            // };
            console.log('x');
            socket.broadcast.emit('getClient', 'a');
        });
    });
}