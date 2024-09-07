Cypress.Commands.add('searchByImage', (imageSelectorPath) => {
    let screenPath = '';
    return (
        cy
            // фоткать нужно всю страницу, чтобы ориентироваться в элементах за пределами viewport
            .screenshot('/tmp/searchImage', {
                overwrite: true,
                onAfterScreenshot($el, props) {
                    screenPath = props.path;
                },
            })
            .then(() => {
                return cy
                    .task('searchByImage', {
                        screenPath: screenPath,
                        elemntPath: imageSelectorPath,
                    })
                    .then((coordinates) => {    
                        cy.log('Координаты эелемента', coordinates);
                        return cy.window().then((win) => {
                            // нужно сначала понять насколько проскроллена страница, и если window.scrollY > coordinates.y проскроллить на
                            if (win.scrollY > coordinates.y) {
                                win.scroll(0, win.scrollY - coordinates.y);
                            }
                            const elem = win.document.elementFromPoint(
                                coordinates.x,
                                coordinates.y
                            );
                            return elem;
                        });
                    });
            })
    );
});
