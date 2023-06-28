import Yup from 'helpers/customValidation';

let validationSchema = Yup.object({
  answers: Yup.array()
    .required('Question is required')
    .of(
      Yup.object().shape({
        is_required: Yup.mixed(),
        question: Yup.mixed(),
        ans_val: Yup.string().when(['is_required'], {
          is: (is_required) => {
            return is_required;
          },
          then: Yup.string().required('Question is required').min(1, 'Please Enter valid answer'),
        }),
      })
    ),
});
// let validationSchema = Yup.object().shape({
//   answers: Yup.array()
//     .of(
//       Yup.object().shape({
//         ans_val: Yup.string().required('Required'), // these constraints take precedence
//       })
//     )
//     .required('Must have friends') // these constraints are shown if and only if inner constraints are satisfied
//     .min(3, 'Minimum of 3 friends'),
// });
export default validationSchema;
