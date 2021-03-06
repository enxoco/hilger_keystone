import { graphql } from "@graphql-ts/schema"
import { checkbox, password, relationship, text, virtual } from "@keystone-6/core/fields"


export default {
    access: {
      operation: {
        query: (context) => !!context.session?.data,
        update: (context) => !!context.session?.data,
        delete: (context) => !!context.session?.data
      }
    },
    fields: {
      name: text({ validation: { isRequired: true }}),
      email: text({
        validation: { isRequired: true },
        isIndexed: "unique",
        isFilterable: true,
      }),
      firstName: text(),
      lastName: text(),
      street: text(),
      city: text(),
      state: text(),      
      phone: text({db: {isNullable: true}}),
      phoneMother: text({db: {isNullable: true}}),
      phoneFather: text({db: {isNullable: true}}),
      zipcode: text(),
      role: relationship({ref: 'Role', many: true}),
      isAdmin: checkbox(),
      isParent: checkbox({defaultValue: false}),
      hasPaidTuition: checkbox({ defaultValue: false}),
      password: password({ validation: { isRequired: true } }),
      courses: relationship({ ref: "Course.teacher", many: true}),
      students: virtual({
        field: graphql.field({
          type: graphql.String,
          async resolve(item, args, context: any) {
            const {id} = context?.req?.body.variables
            const courses = await context.query.Course.findMany({
              where: { teacher: { id: { equals: id } } },
              query: `student {firstName, lastName, name, id}`,
            })
            const students: string[] = []
            courses.map((course) => students.push(course.student))
            return JSON.stringify(students)
          },
        }),
    

      }),
      student: relationship({ref: 'Student.parent', many: true})
    },

    ui: {
      listView: {
        initialColumns: ["name", "lastName", "student", "courses", "email", "isParent"],
      },
    },
  }