export function generateRandomComment() {
    const greetings = [
        'Great post!', 'Interesting read,', 'Loved this article!',
        'Nice work!', 'Fantastic write-up!', 'Absolutely loved this!',
        'What a fantastic read,',
        'This is top notch stuff!',
        'Superbly written!',
        'What an enlightening post!'
    ];
    const mainBodies = [
        'I really learned a lot from this.',
        'This was incredibly insightful.',
        'I had never thought about it that way before.',
        'You brought up some good points.',
        'This has opened my eyes to new possibilities.',
        'Your approach is very thorough.',
        'The examples you used were spot on.',
        'It’s rare to see such depth in a blog post.',
        'Your analysis is very compelling.',
        'The clarity of your arguments is impressive.'
    ];
    const followUps = [
        'Thanks for sharing.',
        'Keep up the good work!',
        'Looking forward to more posts.',
        'Can you elaborate on that last point?',
        'This really helps!',
        'I can’t wait to read your next post.',
        'This made my day.',
        'This is exactly what I needed to read today.',
        'I’ll be sharing this with all my friends.',
        'Please write more about this topic.'
    ];
    const questions = [
        'Do you have any recommendations on further reading?',
        'How do you see this evolving in the future?',
        'What are your thoughts on related topics?',
        'Could you provide more examples?',
        'What do you think are the implications?',
        'Have you considered writing a book?',
        'What inspired you to write this?',
        'Any advice for beginners in this field?',
        'How do you gather your research?',
        'What are the common misconceptions about this?'
    ];

    // Randomly select parts of the comment
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    const mainBody = mainBodies[Math.floor(Math.random() * mainBodies.length)];
    const followUp = followUps[Math.floor(Math.random() * followUps.length)];
    const question = questions[Math.floor(Math.random() * questions.length)];

    // Randomly decide whether to add a question
    const addQuestion = Math.random() > 0.5;

    // Combine parts to form the comment
    return `${greeting} ${mainBody} ${followUp}${addQuestion ? ' ' + question : ''}`;
}
