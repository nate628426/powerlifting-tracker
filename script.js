//TODO: Finish work on updateMessage function
document.getElementById('add-button').addEventListener('click', handleAddButton);
document.getElementById('edit-button').addEventListener('click', handleEditButton);
const script_result = document.getElementById('message1');

async function handleAddButton() {
    const machineValue = document.getElementById('machine1').value;
    const exerciseValue = document.getElementById('exercise1').value;
    const setsValue = document.getElementById('sets1').value;
    const durationValue = document.getElementById('duration1').value;
    const commentsValue = document.getElementById('comments1').value;

    try {
        updateMessage('Successfully added a new exercise!', true); //only shows briefly
        await postData('http://localhost:3000/api/exercise', {
            machine: machineValue,
            exercise: exerciseValue,
            sets: setsValue,
            duration: durationValue,
            comments: commentsValue,
        });
        
    }
    catch (error) {
        updateMessage('Failed to add a new exercise!', false);
        console.error(error)
    }
}

async function handleEditButton() {
    const idValue = document.getElementById('id1').value;
    const machineValue = document.getElementById('machine1').value;
    const exerciseValue = document.getElementById('exercise1').value;
    const setsValue = document.getElementById('sets1').value;
    const durationValue = document.getElementById('duration1').value;
    const commentsValue = document.getElementById('comments1').value;

    try {
        
        await postData('http://localhost:3000/api/exercise', {
            _id: idValue,
            machine: machineValue,
            exercise: exerciseValue,
            sets: setsValue,
            duration: durationValue,
            comments: commentsValue,
        });
        updateMessage('Successfully edited exercise!', true);
        
    }
    catch (error) {
        updateMessage('Failed to edit exercise!', false);
        console.error(error)
    }
}

async function postData(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }
    catch (error) {
        console.error(error);
    }
    finally {
        // if (!response.ok) {
        //     throw new Error(`Network response was not ok. Status:${response.status}`);
        // }
        // console.log("Response from server: " + response.status);
        // return await response.json();
        console.log("Request sent to server")
    }
    
}
//Not working yet
function updateMessage(message, isSuccess) {
    // const messageElement = document.getElementById('message1');
    // messageElement.textContent = message;
    // if (isSuccess) {
    //     messageElement.style.color = 'green'; // Style for success
    // } else {
    //     messageElement.style.color = 'red'; // Style for error
    // }
    // console.log("function updateMessage called")
    script_result.innerHTML = message;
    console.log("function updateMessage called!")
}


