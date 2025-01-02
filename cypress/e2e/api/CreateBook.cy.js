import {adminAuthHeader, baseURL} from "../../support/data";

describe('Create Books', () => {
    let bookTitle;
    let bookAuthor;

    // Use `before` hook to create a book before running tests
    before(() => {
        bookTitle = `Book Title ${Date.now()}`; // Generate unique title
        bookAuthor = 'Author Name';

        cy.request({
            method: 'POST',
            url: `${baseURL}/api/books`,
            headers: adminAuthHeader,
            body: {
                title: bookTitle,
                author: bookAuthor
            }
        }).then((response) => {
            expect(response.status).to.eq(201); // Expect successful creation
            expect(response.body).to.have.property('id');
        });
    });

    // Valid Case
    it('Valid Case: Create a book with mandatory parameters', () => {
        const newTitle = `New Book ${Date.now()}`; // Unique title
        cy.request({
            method: 'POST',
            url: `${baseURL}/api/books`,
            headers: adminAuthHeader,
            body: {
                title: newTitle,
                author: 'Author Test'
            }
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('id');
            expect(response.body).to.have.property('title', newTitle);
            expect(response.body).to.have.property('author', 'Author Test');
        });
    });

    // Duplicate ID Case
    it('Duplicate ID Case: Attempt to create a book with an existing ID', () => {
        cy.request({
            method: 'POST',
            url: `${baseURL}/api/books`,
            headers: adminAuthHeader,
            body: {
                title: bookTitle,
                author: bookAuthor
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(208); // Expect duplicate error
            expect(response.body).to.eq('Book Already Exists'); // Validate string response
        });
    });

    // Invalid Case - Missing Fields
    it('Invalid Case: Missing mandatory fields', () => {
        const uniqueTitle = `Unique Title ${Date.now()}`; // Generate a unique title

        cy.request({
            method: 'POST',
            url: `${baseURL}/api/books`,
            headers: adminAuthHeader,
            body: {
                title: uniqueTitle // Provide a unique title but no author
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400); // Expect 400 for missing fields
            expect(response.body).to.eq('Invalid Input Parameters.'); // Adjust based on API error message
        });
    });
});
