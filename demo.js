//build a circle area calculator
function calculateCircleArea(radius) {
    return Math.PI * radius * radius;
}
//function to fetch data and log the response
async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
