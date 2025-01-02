import {adminAuthHeader, baseURL} from "../../support/data";

describe('Get Books By ID', () => {
    let validId;

    before(() => {
        // Dynamically fetch a valid ID
        cy.request({
            method: 'GET',
            url: `${baseURL}/api/books`,
            headers: adminAuthHeader,
        }).then((response) => {
            if (response.body.length > 0) {
                validId = response.body[0].id; // Use the first available ID
            } else {
                validId = null; // No data available
            }
        });
    });

    it('Valid Case: Get book details for a valid ID', () => {
        if (!validId) {
            cy.log('No valid ID available for testing.');
            return; // Skip test if no data exists
        }
        cy.request({
            method: 'GET',
            url: `${baseURL}/api/books/${validId}`,
            headers: adminAuthHeader,
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('id', validId);
            expect(response.body).to.have.property('title');
            expect(response.body).to.have.property('author');
        });
    });

    it('Edge Case: Pass an invalid ID format', () => {
        const invalidId = 'invalid'; // String instead of an integer
        cy.request({
            method: 'GET',
            url: `${baseURL}/api/books/${invalidId}`,
            headers: adminAuthHeader,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400); // Check status code
            expect(response.body).to.eq('');   // Assert empty body
        });
    });
});
