import fetch from "node-fetch";
async function fetchApi(username) {
    try {
        const response = await fetch(` https://api.github.com/users/${username}/events`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const result = await response.json();
        return result

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

function displayActivity(events) {
    if (!events || events.length === 0) {
        console.log('No recent activity found!');
        return;
    }

    events.forEach(event => {
        let output = '';
        switch (event.type) {
            case 'PushEvent':
                const commits = event.payload.commits.length;
                output = `-Pushed ${commits} commit(s) to ${event.repo.name}`;
                break;
            case 'IssuesEvent':
                output = `-Opened a new issue in ${event.repo.name}`
                break;
            case 'WatchEvent':
                output = `-Starred ${event.repo.name}`
                break;
            case 'ForkEvent':
                output = `- Forked ${event.repo.name}`;
                break;
            default:
                output = `- ${event.type.replace('Event', '')} in ${event.repo.name}`;
        }
        console.log(output);
    });

}

async function main() {
    const args = process.argv.slice(2);
    console.log('args',args);
    if (args.length === 0) {
        console.error('Please provide a GitHub username as an argument.');
        process.exit(1);
    }

    const username = args[0];
    console.log('username', username);
    const events = await fetchApi(username);
    displayActivity(events);

}

main();