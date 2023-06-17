const response = require('../../../helpers/response.helper');
const models = require('../../../models/index');

class CMSController {
  /**
   * @name getCMSpages
   * @description Get CMS page Content.
   * @param {Request} req
   * @param {Response} res
   * @returns {Json} response
   */
  async getCMSpages(req, res) {
    try {
      const { cms_id } = req.params;
      let cmsPageData = await models.CMS.findOne({
        where: {
          cms_id,
        },
      });
      if (!cmsPageData) {
        const cmsPageDataSlug = await models.CMS.findOne({
          where: {
            slug: cms_id,
          },
        });
        if (!cmsPageDataSlug) throw new Error('admin.error.cms_page_not_found');
        else cmsPageData = cmsPageDataSlug;
      }
      return response.successResponse(
        req,
        res,
        'admin.success.cms_page_found_successful',
        cmsPageData
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message);
    }
  }
}

module.exports = new CMSController();
