exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type CategoriesJson implements Node {
      name: String!
      interests: [String]
      subCategories: [SubCategory]
      questions: [Question]
    }

    type SubCategory {
      name: String!
      interests: [String]
    }

    type Question {
      text: String!
      relatedInterests: [String]
    }
  `;
  createTypes(typeDefs);
}; 