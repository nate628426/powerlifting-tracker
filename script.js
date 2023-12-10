document.getElementById('add-button').addEventListener('click', handleAddButton);
document.getElementById('edit-button').addEventListener('click', handleEditButton);
document.getElementById('search-button').addEventListener('click', handleSearchButton);
document.getElementById('delete-button').addEventListener('click', handleDeleteButton);

const script_result = document.getElementById('message1');
//For Adding information to MongoDB Database
async function handleAddButton() {
    //prevent page reload
    event.preventDefault();
    //Get HTML form data to put into object
    const idValue = document.getElementById('_id').value;
    const machineValue = document.getElementById('machine1').value;
    const exerciseValue = document.getElementById('exercise1').value;
    const setsValue = document.getElementById('sets1').value;
    const durationValue = document.getElementById('duration1').value;
    const commentsValue = document.getElementById('comments1').value;
    //Requires ID Value, unique.
    if (idValue === '') {
        updateMessage('Failed to add exercise! _id is required.', false);
        return;
    }
    try {
        //send data to postData to send to server 
        updateMessage('Successfully added a new exercise!', true); 
        await postData('http://localhost:3000/api/exercise', {
            _id: idValue,
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
//Edit Data in MongoDB database, identical structure to handleAddButton()
async function handleEditButton() {
    event.preventDefault();
    const idValue = document.getElementById('_id').value;
    const machineValue = document.getElementById('machine1').value;
    const exerciseValue = document.getElementById('exercise1').value;
    const setsValue = document.getElementById('sets1').value;
    const durationValue = document.getElementById('duration1').value;
    const commentsValue = document.getElementById('comments1').value;

    if (idValue === '') {
        updateMessage('Failed to edit exercise! _id is required.', false);
        return;
    }

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
//Search for information in MongoDB Database
async function handleSearchButton(event) {
    event.preventDefault();
    const idValue = document.getElementById('_id').value;
    const machineValue = document.getElementById('machine1').value;
    const exerciseValue = document.getElementById('exercise1').value;
    const setsValue = document.getElementById('sets1').value;
    const durationValue = document.getElementById('duration1').value;

    // Create an object for the query
    let query = {};

    // Only add properties to the query if their corresponding input values are not empty
    if (idValue !== '') query._id = idValue;
    if (machineValue !== '') query.machine = machineValue;
    if (exerciseValue !== '') query.exercise = exerciseValue;
    if (setsValue !== '') query.sets = setsValue;
    if (durationValue !== '') query.duration = durationValue;

    try {
        //send to different API URL than add/edit.
        const response = await postData('http://localhost:3000/api/search', query);
        const data = await response.json(); // Parse JSON response body
        updateMessage('Search completed!', true);
        displaySearchResults(data); // Pass parsed data to displaySearchResults
    }
    catch (error) {
        updateMessage('Failed to complete search!', false);
        console.error(error)
    }
}
//Delete data from MongoDB Database
async function handleDeleteButton(event) {
    event.preventDefault();
    //Only takes in _id, so required field.
    const idValue = document.getElementById('delete_id').value;
    if (idValue === '') {
        updateMessage('Failed to delete exercise! _id is required.', false);
        return;
    }
    try {
        //Different API URL
        await postData('http://localhost:3000/api/delete', { _id: idValue });
        updateMessage('Successfully deleted exercise!', true);
    }
    catch (error) {
        updateMessage('Failed to delete exercise!', false);
        console.error(error)
    }
}
//Dynamically display search results from MongoDB Database
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) {
        console.error('Could not find results container');
        return;
    }
    resultsContainer.innerHTML = ''; // Clear previous results
    if (!Array.isArray(results)) {
        console.error('Results is not an array');
        return;
    }
    results.forEach(result => {
        const resultDiv = document.createElement('div');
        
        // Create a formatted HTML representation of the result
        const resultHTML = `
            <p><strong>ID:</strong> ${result._id}</p>
            <p><strong>Machine:</strong> ${result.machine}</p>
            <p><strong>Exercise:</strong> ${result.exercise}</p>
            <p><strong>Sets:</strong> ${result.sets}</p>
            <p><strong>Duration:</strong> ${result.duration}</p>
        `;
        
        resultDiv.innerHTML = resultHTML;
        resultsContainer.appendChild(resultDiv);
    });
}
//Add data to MongoDB Database, but this time enforce/validate data type through Mongoose ODM technology.
async function handleStrictAddButton(event) {
    event.preventDefault();
    const coach_id = document.getElementById('coach_id').value;
    const machine = document.getElementById('strict_machine').value;
    const exercise = document.getElementById('strict_exercise').value;
    const sets = document.getElementById('strict_sets').value;
    const duration = document.getElementById('strict_duration').value;
    const comments = document.getElementById('strict_comments').value;

    const data = { _id: coach_id, machine, exercise, sets, duration, comments };

    try {
        //New API URL
        await postData('http://localhost:3000/api/strict-add', data);
        updateMessage('Successfully strictly added exercise!', true);
    }
    catch (error) {
        updateMessage('Failed to strictly add exercise!', false);
        console.error(error)
    }
}
//Send data to server for modifying information in MongoDB database
async function postData(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response; 
    } catch (error) {
        console.error('Error:', error);
    }
}
//Validation message for front-end depending on action performed.
function updateMessage(message, isSuccess) {
    script_result.textContent = message;
    script_result.className = isSuccess ? 'success' : 'error';
}


