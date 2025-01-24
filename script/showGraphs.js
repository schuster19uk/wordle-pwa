function showGraph(stats) {

    if (dailyChartInstance) {
      dailyChartInstance.destroy(); // Destroy the previous chart
    }

    if (monthlyChartInstance) {
      monthlyChartInstance.destroy(); // Destroy the previous chart
    }

    if (overallChartInstance) {
      overallChartInstance.destroy(); // Destroy the previous chart
    }

    const ctx = document.getElementById('dailyChart').getContext('2d');
    dailyChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['W', 'L'], // Chart labels
            datasets: [{
                label: 'Today',
                data: [stats.today.wins, stats.today.fails], // Example data
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)', // Color for Wins
                    'rgba(255, 99, 132, 0.6)' // Color for Losses
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)', // Border color for Wins
                    'rgba(255, 99, 132, 1)' // Border color for Losses
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Today',
                    font: { size: 16 , family: 'Arial, sans-serif', weight: 'bold' },
                    color: 'white'
                },
                legend: {
                  display: false // Hide the legend
              },
                datalabels: {
                    display: true,
                    color: 'black',
                    font: { size: 16 },
                    formatter: (value, context) => {
                        // Get label and calculate percentage
                        const label = context.chart.data.labels[context.dataIndex];
                        const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
                        const percentage = ((value / total) * 100).toFixed(0);
                        // Combine label and percentage
                        return `${label}:${value} \n${percentage}%`;
                    },
                    align: 'center', // Center align within the segment
                    anchor: 'center' // Anchor to the center of the segment
                }
            }
        },
        plugins: [ChartDataLabels] // Register the DataLabels plugin
    });          

    const ctxa = document.getElementById('monthlyChart').getContext('2d');
    monthlyChartInstance = new Chart(ctxa, {
        type: 'pie',
        data: {
            labels: ['W', 'L'], // Chart labels
            datasets: [{
                label: 'This Month',
                data: [stats.thisMonth.wins, stats.thisMonth.fails], // Example data
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)', // Color for Wins
                    'rgba(255, 99, 132, 0.6)' // Color for Losses
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)', // Border color for Wins
                    'rgba(255, 99, 132, 1)' // Border color for Losses
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'This Month',
                    font: { size: 16 , family: 'Arial, sans-serif', weight: 'bold' },
                    color: 'white'
                },
                legend: {
                  display: false // Hide the legend
              },
                datalabels: {
                    display: true,
                    color: 'black',
                    font: { size: 16 },
                    formatter: (value, context) => {
                        // Get label and calculate percentage
                        const label = context.chart.data.labels[context.dataIndex];
                        const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
                        const percentage = ((value / total) * 100).toFixed(0);
                        // Combine label and percentage
                        return `${label}:${value} \n${percentage}%`;
                    },
                    align: 'center', // Center align within the segment
                    anchor: 'center' // Anchor to the center of the segment
                }
            }
        },
        plugins: [ChartDataLabels] // Register the DataLabels plugin
    });  

    const ctxo = document.getElementById('overallChart').getContext('2d');
    overallChartInstance = new Chart(ctxo, {
        type: 'pie',
        data: {
            labels: ['W', 'L'], // Chart labels
            datasets: [{
                label: 'Overall',
                data: [stats.overall.wins, stats.overall.fails], // Example data
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)', // Color for Wins
                    'rgba(255, 99, 132, 0.6)' // Color for Losses
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)', // Border color for Wins
                    'rgba(255, 99, 132, 1)' // Border color for Losses
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Overall',
                    font: { size: 16 , family: 'Arial, sans-serif', weight: 'bold' },
                    color: 'white'
                },
                legend: {
                  display: false // Hide the legend
              },
                datalabels: {
                    display: true,
                    color: 'black',
                    font: { size: 16 },
                    formatter: (value, context) => {
                        // Get label and calculate percentage
                        const label = context.chart.data.labels[context.dataIndex];
                        const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
                        const percentage = ((value / total) * 100).toFixed(0);
                        // Combine label and percentage
                        return `${label}:${value} \n${percentage}%`;
                    },
                    align: 'center', // Center align within the segment
                    anchor: 'center' // Anchor to the center of the segment
                }
            }
        },
        plugins: [ChartDataLabels] // Register the DataLabels plugin
    });  
}