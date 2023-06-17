// This Route file will be use for admin login.
const adminAuthRoute = require('./backend/admin.auth.route');
const adminUserRoute = require('./backend/admin.user.route');
const adminCommonRoute = require('./backend/admin.common.route');
const adminEmailTemplate = require('./backend/admin.email_template.route');
const adminCMS = require('./backend/admin.cms.route');
const adminOurTeam = require('./backend/admin.ourTeam.route');
const adminTranslation = require('./backend/admin.translation.route');
const adminSettings = require('./backend/admin.settings.route');
const adminSpecialities = require('./backend/admin.specialities.route');
const adminStates = require('./backend/admin.states.route');
const adminQuestion = require('./backend/admin.question.route');
const adminFormulary = require('./backend/admin.formulary.route');
const adminOrganization = require('./backend/admin.organization.route');
const adminTransaction = require('./backend/admin.transaction.route');
const adminPatient = require('./backend/admin.patient.route');
const adminOrganizationAvailability = require('./backend/admin.organization.availability.route');
const adminDomainProvider = require('./backend/admin.domain_provider.route');

const frontendCmsRoute = require('./frontend/frontend.cms.route');
const frontendOrganization = require('./frontend/frontend.organization.route');
const frontendFormulary = require('./frontend/frontend.formulary.route');
const frontendPatient = require('./frontend/frontend.patient.route');
const frontendCart = require('./frontend/frontend.cart.route');
const frontendOrganizationSettings = require('./frontend/frontend.settings.route');
const frontQuestion = require('./frontend/frontend.question.route');
const frontAuthRoute = require('./frontend/frontend.auth.route');
const frontHome = require('./frontend/frontend.home.route');
const frontCard = require('./frontend/frontend.card.route');
const frontOrder = require('./frontend/frontend.order.route');
const frontChat = require('./frontend/frontend.chat.route');
const frontToken = require('./frontend/frontend.token.route');
const frontPatientChart = require('./frontend/frontend.patientchart.route');
const frontAvailability = require('./frontend/frontend.availability.route');
const frontBooking = require('./frontend/frontend.booking.route');
const frontendStaff = require('./frontend/frontend.staff.route');
const frontOrderBookAppointment = require('./frontend/frontend.order.bookappointment.route');
const frontendOrgPatient = require('./frontend/frontend.org_patient.route');

const { HOST_URL_PREFIX } = process.env;
module.exports = (app) => {
  /** Admin Routes */
  app.use(`${HOST_URL_PREFIX}/admin/auth`, adminAuthRoute);
  app.use(`${HOST_URL_PREFIX}/admin/user`, adminUserRoute);
  app.use(`${HOST_URL_PREFIX}/admin/email-template`, adminEmailTemplate);
  app.use(`${HOST_URL_PREFIX}/admin/cms`, adminCMS);
  app.use(`${HOST_URL_PREFIX}/admin/our-team`, adminOurTeam);
  app.use(`${HOST_URL_PREFIX}/admin/translation`, adminTranslation);
  app.use(`${HOST_URL_PREFIX}/admin/settings`, adminSettings);
  app.use(`${HOST_URL_PREFIX}/admin/common`, adminCommonRoute);
  app.use(`${HOST_URL_PREFIX}/admin/specialities`, adminSpecialities);
  app.use(`${HOST_URL_PREFIX}/admin/states`, adminStates);
  app.use(`${HOST_URL_PREFIX}/admin/question`, adminQuestion);
  app.use(`${HOST_URL_PREFIX}/admin/formulary`, adminFormulary);
  app.use(`${HOST_URL_PREFIX}/admin/organization`, adminOrganization);
  app.use(`${HOST_URL_PREFIX}/admin/transaction`, adminTransaction);
  app.use(`${HOST_URL_PREFIX}/admin/patient`, adminPatient);
  app.use(
    `${HOST_URL_PREFIX}/admin/availability`,
    adminOrganizationAvailability
  );
  app.use(`${HOST_URL_PREFIX}/admin/domain-provider`,adminDomainProvider);

  /** Front Routes */

  app.use(`${HOST_URL_PREFIX}/front/auth`, frontAuthRoute);
  app.use(`${HOST_URL_PREFIX}/front/cms`, frontendCmsRoute);
  app.use(`${HOST_URL_PREFIX}/front/home`, frontHome);
  app.use(`${HOST_URL_PREFIX}/front/organization`, frontendOrganization);
  app.use(`${HOST_URL_PREFIX}/front/question`, frontQuestion);
  app.use(`${HOST_URL_PREFIX}/front/formulary`, frontendFormulary);
  app.use(`${HOST_URL_PREFIX}/front/patient`, frontendPatient);
  app.use(`${HOST_URL_PREFIX}/front/settings`, frontendOrganizationSettings);
  app.use(`${HOST_URL_PREFIX}/front/cart`, frontendCart);
  app.use(`${HOST_URL_PREFIX}/front/card`, frontCard);
  app.use(`${HOST_URL_PREFIX}/front/order`, frontOrder);
  app.use(`${HOST_URL_PREFIX}/front/chat`, frontChat);
  app.use(`${HOST_URL_PREFIX}/front/token`, frontToken);
  app.use(`${HOST_URL_PREFIX}/front/patientchart`, frontPatientChart);
  app.use(`${HOST_URL_PREFIX}/front/availability`, frontAvailability);
  app.use(`${HOST_URL_PREFIX}/front/booking`, frontBooking);
  app.use(`${HOST_URL_PREFIX}/front/staff`, frontendStaff);
  app.use(`${HOST_URL_PREFIX}/front/order`, frontOrderBookAppointment);
  app.use(`${HOST_URL_PREFIX}/front/organization/patient`, frontendOrgPatient);
};
