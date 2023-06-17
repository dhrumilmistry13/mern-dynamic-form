const { Op } = require('sequelize');
const response = require('../../../helpers/response.helper');
const models = require('../../../models/index');
const PaginationLength = require('../../../config/pagination.config');
const { getFolderConfig } = require('../../../config/upload.config');
const { fileUploadUrl } = require('../../../helpers/s3file.helper');

class OurTeamController {
  /**
   * @name addOurTeam
   * @description Store OurTeam Data.
   * @param req,res
   * @returns {Json} success
   */
  async addOurTeam(req, res) {
    try {
      const { name, designation, is_active } = req.body;
      const our_team_image = 'abc';
      const uploadPromises = [];
      await models.OurTeam.create({
        name,
        designation,
        image: our_team_image,
        is_active,
      }).then(async (dataSave) => {
        const file = req.files[0];
        const fileFolderPath = getFolderConfig().our_team_image;
        const folder_path = fileFolderPath.file_path.replace(
          fileFolderPath.replace,
          dataSave.our_team_id
        );
        const fileurl = await fileUploadUrl(file, folder_path);
        if (fileurl) {
          const pathArray1 = fileurl.filename.split('/');
          const file_name = pathArray1[pathArray1.length - 1];
          dataSave.image = file_name;
          dataSave.save();
        }
        uploadPromises.push(fileurl);
      });
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.create_our_team_success',
          uploadPromises
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name editOurTeam
   * @description Update OurTeam Data.
   * @param req,res
   * @returns {Json} success
   */
  async editOurTeam(req, res) {
    try {
      const { our_team_id, name, designation, is_active } = req.body;
      const pathArray =
        req.body.our_team_image !== undefined
          ? req.body.our_team_image.split('/')
          : [];
      const pathArray2 =
        pathArray.length > 0 ? pathArray[pathArray.length - 1].split('?') : [];
      const our_team_image =
        pathArray2.length > 0 ? pathArray2[pathArray2.length - 2] : '';
      const uploadPromises = [];
      await models.OurTeam.update(
        {
          name,
          designation,
          image: our_team_image,
          is_active,
        },
        {
          where: {
            our_team_id,
          },
        }
      ).then(async () => {
        if (req.files.length > 0) {
          const file = req.files[0];
          const fileFolderPath = getFolderConfig().our_team_image;
          const folder_path = fileFolderPath.file_path.replace(
            fileFolderPath.replace,
            our_team_id
          );
          const fileurl = await fileUploadUrl(file, folder_path);
          if (fileurl) {
            const pathArray1 = fileurl.filename.split('/');
            const file_name = pathArray1[pathArray1.length - 1];
            await models.OurTeam.update(
              {
                image: file_name,
              },
              {
                where: {
                  our_team_id,
                },
              }
            );
          }
          uploadPromises.push(fileurl);
        }
      });
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.update_our_team_success',
          uploadPromises
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name getOurTeam
   * @description Get OurTeam Data.
   * @param req,res
   * @returns {Json} success
   */
  async getOurTeam(req, res) {
    try {
      const { our_team_id } = req.query;
      const getData = await models.OurTeam.findOne({
        where: {
          our_team_id,
        },
      });
      const getOurTeamData = {
        our_team_id: getData.our_team_id,
        name: getData.name,
        designation: getData.designation,
        image: await getData.image.then((dataUrl) => dataUrl),
        is_active: getData.is_active,
      };
      return setTimeout(() => {
        response.successResponse(
          req,
          res,
          'admin.get_our_team_success',
          getOurTeamData
        );
      }, 200);
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name updateStatusOurTeam
   * @description Update Status OurTeam.
   * @param req,res
   * @returns {Json} success
   */
  async updateStatusOurTeam(req, res) {
    try {
      const { our_team_id } = req.body;
      const getOurTeamData = await models.OurTeam.findOne({
        where: {
          our_team_id,
        },
      });
      if (getOurTeamData) {
        await models.OurTeam.update(
          {
            is_active: getOurTeamData.is_active === 1 ? 2 : 1,
          },
          {
            where: {
              our_team_id,
            },
          }
        );
        return response.successResponse(
          req,
          res,
          'admin.update_status_our_team_success'
        );
      }
      return response.successResponse(
        req,
        res,
        'admin.update_status_our_team_success_not'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name deleteOurTeam
   * @description delete OurTeam Data.
   * @param req,res
   * @returns {Json} success
   */
  async deleteOurTeam(req, res) {
    try {
      const { our_team_id } = req.query;
      await models.OurTeam.destroy({
        where: {
          our_team_id,
        },
      });

      return response.successResponse(
        req,
        res,
        'admin.delete_our_team_success'
      );
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }

  /**
   * @name listOurTeam
   * @description Get All OurTeam Data.
   * @param req,res
   * @returns {Json} success
   */
  async listOurTeam(req, res) {
    try {
      const { page, serach_text, is_active } = req.query;
      const wherecondition = [];
      wherecondition.push({
        [Op.or]: {
          name: {
            [Op.like]: `%${serach_text}%`,
          },
          designation: {
            [Op.like]: `%${serach_text}%`,
          },
        },
      });

      const condition = {
        attributes: [
          'our_team_id',
          'name',
          'designation',
          'is_active',
          'created_at',
        ],
      };
      if (is_active !== '') {
        wherecondition.push({ is_active });
      }
      condition.where = wherecondition;
      condition.page = page;
      condition.paginate = PaginationLength.getOurTeam();
      condition.order = [['our_team_id', 'DESC']];
      const { docs, pages, total } = await models.OurTeam.paginate(condition);
      return response.successResponse(req, res, 'admin.get_our_team_success', {
        pagination: {
          total,
          count: docs.length,
          current_page: page,
          last_page: pages,
          per_page: PaginationLength.getOurTeam(),
          hasMorePages: pages > parseInt(page, 10),
        },
        our_team_list: docs,
      });
    } catch (error) {
      return response.errorResponse(req, res, error.message, {}, 500);
    }
  }
}
module.exports = new OurTeamController();
