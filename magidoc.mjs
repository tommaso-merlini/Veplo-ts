export default {
  introspection: {
    type: "sdl",
    paths: "http://localhost:3000/graphql",
  },
  website: {
    template: "carbon-multi-page",
    options: {
      queryGenerationFactories: {
        Upload: "Upload",
      },
      appTitle: "Veplo GraphQL API Documetnation",
      // appLogo: 'https://seeklogo.com/images/P/Pokemon-logo-497D61B223-seeklogo.com.png',
      pages: [
        {
          title: "HomePage",
          content: `
                    # Veplo GraphQL API Documentation
                    Ottimo! questa e' la graphql documentation ufficiale di veplo.it
                    ## cosa posso fare?
                    - vedere tutti i types
                    - vedere tutte le mutation
                    - vedere tutte le query

                  `,
        },
      ],
    },
  },
};
