import client from 'libs/HttpClient';

class SettingsServices {
  static viewHomeBanner(request) {
    return client.get(`/admin/settings/get-home-banner`, request);
  }

  static updateHomeBanner(request) {
    return client.post(`/admin/settings/home-banner`, request, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    });
  }
  static viewABoutUs(request) {
    return client.get(`/admin/settings/get-home-about-us`, request);
  }

  static updateABoutUs(request) {
    return client.post(`/admin/settings/home-about-us`, request, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    });
  }
  static viewHowItWorks(request) {
    return client.get(`/admin/settings/get-home-how-its-work`, request);
  }

  static updateHowItWorks(request) {
    return client.post(`/admin/settings/home-how-its-work`, request, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    });
  }
  static viewGetInTouch(request) {
    return client.get(`/admin/settings/get-get-in-touch`, request);
  }

  static updateGetInTouch(request) {
    return client.post(`/admin/settings/home-get-in-touch`, request, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    });
  }
  static viewOurTeam(request) {
    return client.get(`/admin/settings/get-home-our-team`, request);
  }

  static updateOurTeam(request) {
    return client.post(`/admin/settings/home-our-team`, request);
  }
  static getSettingData() {
    return client.get('admin/settings/get-home-general');
  }
  static storeSettingData(request) {
    return client.post('admin/settings/home-general', request, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    });
  }
  static getSettingSeoData() {
    return client.get('admin/settings/get-home-seo');
  }
  static storeSettingSeoData(request) {
    return client.put('admin/settings/home-seo', request);
  }
  static viewSubscriptionPlan(request) {
    return client.get(`/admin/settings/get-subscription-plan`, request);
  }

  static updateSubscriptionPlan(request) {
    const Val = JSON.stringify(request.home_page_subscription_plan_what_you_will_get_add_new);
    request.home_page_subscription_plan_what_you_will_get_add_new = Val;
    return client.post(`/admin/settings/home-subscription-plan`, request);
  }
}
export { SettingsServices };
