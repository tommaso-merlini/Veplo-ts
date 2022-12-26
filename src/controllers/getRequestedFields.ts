import graphqlFields from "graphql-fields";

//this function takes the mongodbqueryfields and returns them with value of 1 => so we can filter the mongodbquery
const getRequestedFields = (info: any) => {
  const requestedFields = graphqlFields(info);
  for (var key in requestedFields) {
    if (requestedFields.hasOwnProperty(key)) {
      requestedFields[key] = 1;
    }
  }

  return requestedFields;
};

export default getRequestedFields;
