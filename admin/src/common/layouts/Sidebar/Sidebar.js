import { React } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const Sidebar = (props) => {
  const { t } = props;

  return (
    <>
      <aside id="sidebar-wrapper">
        <div className="sidebar mt-4">
          <nav className="navigation">
            <ul className="mainmenu">
              <li>
                <NavLink to="/dashboard" onClick={props.toggleClass}>
                  <span>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke="#4d8481"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <rect
                        x="13.8333"
                        y="3"
                        width="7.16667"
                        height="7.16667"
                        rx="2"
                        stroke="#4d8481"
                        strokeWidth="2"
                      />
                      <rect
                        x="13.8333"
                        y="13.8333"
                        width="7.16667"
                        height="7.16667"
                        rx="2"
                        stroke="#4d8481"
                        strokeWidth="2"
                      />
                      <rect
                        x="3"
                        y="13.8333"
                        width="7.16667"
                        height="7.16667"
                        rx="2"
                        stroke="#4d8481"
                        strokeWidth="2"
                      />
                      <rect
                        x="3"
                        y="3"
                        width="7.16667"
                        height="7.16667"
                        rx="2"
                        stroke="#4d8481"
                        strokeWidth="2"
                      />
                    </svg>
                  </span>
                  {t('page.sidebar_dashboard')}
                </NavLink>
              </li>
              <li>
                <NavLink to="/question/list" onClick={props.toggleClass}>
                  <span>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_5599_7999)">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M11.9297 0.000575515C12.6422 -0.00411198 13.0219 0.0193255 13.5141 0.089638C13.8656 0.141201 14.3625 0.230263 14.6156 0.281825C14.8641 0.338075 15.3328 0.464638 15.6562 0.567763C15.9797 0.670888 16.4859 0.863075 16.7812 0.989638C17.0766 1.1162 17.5312 1.33651 17.7891 1.48183C18.0469 1.62714 18.4359 1.86151 18.6562 2.01151C18.8766 2.15683 19.2656 2.44745 19.5234 2.6537C19.7812 2.85995 20.2125 3.24433 20.4797 3.5162C20.7469 3.78339 21.1359 4.21464 21.3422 4.47245C21.5484 4.73026 21.8391 5.11933 21.9844 5.33964C22.1344 5.55995 22.3594 5.93495 22.4953 6.17401C22.6266 6.40839 22.8328 6.82089 22.95 7.08808C23.0719 7.35058 23.2688 7.87089 23.3906 8.24589C23.5172 8.62089 23.6578 9.12714 23.7094 9.37089C23.7656 9.61464 23.85 10.1162 23.9016 10.4865C23.9719 10.9553 24 11.3912 24 11.9631C24 12.4178 23.9672 13.0131 23.9297 13.3318C23.8875 13.6412 23.8031 14.1521 23.7422 14.4709C23.6766 14.7849 23.5219 15.3521 23.3953 15.7365C23.2688 16.1162 23.0813 16.6131 22.9781 16.8474C22.8703 17.0771 22.6641 17.4896 22.5187 17.7615C22.3734 18.0334 22.1297 18.4318 21.9844 18.6521C21.8391 18.8724 21.5484 19.2615 21.3422 19.5193C21.1359 19.7771 20.7469 20.2084 20.4797 20.4756C20.2125 20.7474 19.7812 21.1318 19.5234 21.3381C19.2656 21.5443 18.8766 21.8349 18.6562 21.9803C18.4359 22.1303 18.0375 22.3693 17.7656 22.5193C17.4937 22.6693 17.0391 22.8943 16.7578 23.0162C16.4719 23.1334 15.9797 23.3209 15.6562 23.424C15.3328 23.5271 14.8641 23.6537 14.6156 23.7099C14.3625 23.7615 13.8656 23.8506 13.5141 23.9021C13.05 23.9678 12.6187 23.9959 12 23.9959C11.3625 23.9959 10.9594 23.9724 10.4766 23.8974C10.1156 23.8459 9.61875 23.7615 9.375 23.7053C9.13125 23.6537 8.625 23.5131 8.25 23.3865C7.875 23.2646 7.36875 23.0724 7.125 22.9646C6.88125 22.8521 6.46875 22.6459 6.21094 22.5053C5.95312 22.3646 5.56406 22.1256 5.34375 21.9803C5.12344 21.8349 4.73438 21.5443 4.47656 21.3381C4.21875 21.1318 3.7875 20.7428 3.52031 20.4756C3.25312 20.2084 2.86406 19.7771 2.65781 19.5193C2.45156 19.2615 2.16094 18.8724 2.01562 18.6521C1.86562 18.4318 1.64062 18.0568 1.50469 17.8224C1.37344 17.5834 1.16719 17.1709 1.05 16.9084C0.928125 16.6412 0.73125 16.1209 0.609375 15.7459C0.482812 15.3709 0.342187 14.8646 0.290625 14.6209C0.234375 14.3771 0.15 13.8756 0.0984375 13.5099C0.028125 13.0365 0 12.6006 0 12.0334C0 11.574 0.0328125 10.9787 0.0703125 10.6599C0.1125 10.3506 0.196875 9.84432 0.257812 9.53495C0.31875 9.22557 0.459375 8.69589 0.567188 8.36307C0.675 8.02557 0.8625 7.51932 0.979687 7.23807C1.10156 6.95214 1.32656 6.50214 1.47656 6.23026C1.62656 5.95839 1.86562 5.55995 2.01562 5.33964C2.16094 5.11933 2.45156 4.73026 2.65781 4.47245C2.86406 4.21464 3.25312 3.78339 3.52031 3.5162C3.7875 3.24901 4.21875 2.85995 4.47656 2.6537C4.73438 2.44745 5.12344 2.15683 5.34375 2.01151C5.56406 1.86151 5.9625 1.62245 6.23438 1.47245C6.50625 1.32245 6.95625 1.09745 7.24219 0.975575C7.52344 0.858388 8.02031 0.670888 8.34375 0.567763C8.66719 0.464638 9.14062 0.338075 9.39844 0.281825C9.65625 0.225575 10.1203 0.141201 10.4297 0.0943255C10.8234 0.033388 11.2734 0.00526302 11.9297 0.000575515V0.000575515ZM10.1016 1.85214C9.86719 1.89433 9.43594 1.99745 9.14062 2.08183C8.84531 2.1662 8.4375 2.30214 8.23594 2.38183C8.03906 2.46151 7.65938 2.63495 7.39688 2.7662C7.12969 2.90214 6.74531 3.11308 6.53906 3.24433C6.33281 3.37089 5.9625 3.62401 5.71875 3.81151C5.475 3.99433 5.02031 4.39745 4.71094 4.70683C4.40156 5.0162 3.99844 5.47089 3.81563 5.71464C3.62813 5.95839 3.375 6.3287 3.24844 6.53495C3.11719 6.7412 2.89687 7.13964 2.75625 7.42557C2.61094 7.70682 2.42344 8.14276 2.32969 8.38651C2.24063 8.63026 2.1 9.07557 2.02031 9.37089C1.94531 9.6662 1.84219 10.1209 1.79531 10.3787C1.73437 10.7443 1.71562 11.1006 1.71562 11.9959C1.71562 12.8912 1.73437 13.2475 1.79531 13.6131C1.84219 13.8709 1.94531 14.3256 2.02031 14.6209C2.1 14.9162 2.24063 15.3615 2.32969 15.6053C2.42344 15.849 2.61094 16.2803 2.75625 16.5662C2.89687 16.8474 3.11719 17.2506 3.24844 17.4568C3.375 17.6631 3.62813 18.0334 3.81563 18.2771C3.99844 18.5209 4.40156 18.9756 4.71094 19.2849C5.02031 19.5943 5.475 19.9974 5.71875 20.1803C5.9625 20.3631 6.33281 20.6209 6.53906 20.7475C6.74531 20.8787 7.12969 21.0896 7.39688 21.2256C7.65938 21.3568 8.03438 21.5256 8.22656 21.6053C8.41875 21.6803 8.78438 21.8068 9.0375 21.8818C9.28594 21.9568 9.66094 22.0506 9.86719 22.0974C10.0734 22.1396 10.4859 22.2053 10.7812 22.2428C11.0766 22.2803 11.625 22.3084 12 22.3084C12.375 22.3084 12.9234 22.2803 13.2188 22.2428C13.5141 22.2053 13.9266 22.1396 14.1328 22.0974C14.3391 22.0506 14.7141 21.9568 14.9672 21.8818C15.2156 21.8068 15.5813 21.6803 15.7734 21.6053C15.9656 21.5256 16.3406 21.3568 16.6078 21.2256C16.8703 21.0896 17.2547 20.8787 17.4609 20.7475C17.6672 20.6209 18.0375 20.3678 18.2812 20.1803C18.525 19.9974 18.9797 19.5943 19.2891 19.2849C19.5984 18.9756 20.0016 18.5209 20.1844 18.2771C20.3719 18.0334 20.625 17.6631 20.7516 17.4568C20.8828 17.2506 21.0937 16.8662 21.2297 16.599C21.3609 16.3365 21.5297 15.9615 21.6094 15.7693C21.6844 15.5771 21.8109 15.2115 21.8859 14.9584C21.9609 14.71 22.0547 14.335 22.1016 14.1287C22.1437 13.9225 22.2094 13.51 22.2469 13.2146C22.2844 12.9193 22.3125 12.3709 22.3125 11.9959C22.3125 11.6209 22.2844 11.0724 22.2469 10.7771C22.2094 10.4818 22.1437 10.0693 22.1016 9.86307C22.0547 9.65682 21.9609 9.28182 21.8859 9.0287C21.8109 8.78026 21.6844 8.41464 21.6094 8.22245C21.5297 8.03026 21.3609 7.65526 21.2297 7.38807C21.0937 7.12557 20.8828 6.7412 20.7516 6.53495C20.625 6.3287 20.3719 5.95839 20.1844 5.71464C20.0016 5.47089 19.5984 5.0162 19.2891 4.70683C18.9797 4.39745 18.525 3.99433 18.2812 3.80683C18.0375 3.62401 17.6672 3.37089 17.4609 3.24433C17.2547 3.11308 16.8516 2.89276 16.5703 2.75214C16.2844 2.60683 15.8438 2.41464 15.5859 2.3162C15.3281 2.22245 14.925 2.0912 14.6953 2.03026C14.4609 1.96933 14.0297 1.87089 13.7344 1.81933C13.3266 1.74433 12.9516 1.7162 12.1875 1.70683C11.6344 1.69745 11.0297 1.70683 10.8516 1.73026C10.6687 1.75839 10.3313 1.80995 10.1016 1.85214ZM12 5.97714C12.1172 5.98651 12.3187 6.00057 12.4453 6.01464C12.5766 6.02401 12.825 6.07089 13.0078 6.11308C13.1859 6.15995 13.4625 6.2537 13.6172 6.31932C13.7719 6.38964 13.9922 6.51151 14.1094 6.5912C14.2266 6.67089 14.4 6.8162 14.5031 6.91464C14.6016 7.01776 14.7469 7.1912 14.8266 7.30839C14.9062 7.42557 15.0094 7.61776 15.0563 7.73964C15.1031 7.8662 15.1594 8.10526 15.1875 8.2787C15.2156 8.48964 15.2156 8.70995 15.1828 8.92557C15.1594 9.1037 15.0844 9.38026 15.0187 9.53495C14.9578 9.68964 14.8359 9.9287 14.7516 10.0646C14.6719 10.2053 14.4844 10.4584 14.3391 10.6271C14.1984 10.8006 13.8422 11.1381 13.5563 11.3724C13.2375 11.6396 12.9656 11.9068 12.8672 12.0521C12.7781 12.1881 12.675 12.4271 12.6328 12.5818C12.5953 12.7365 12.5625 13.0225 12.5625 13.2146C12.5625 13.4584 12.5391 13.6178 12.4781 13.7256C12.4313 13.824 12.3234 13.9271 12.2109 13.9834C12.0656 14.0537 11.9344 14.0771 11.6484 14.0771C11.3906 14.0771 11.2266 14.049 11.1187 13.9975C11.025 13.9459 10.9359 13.8428 10.875 13.7162C10.8 13.5568 10.7812 13.4162 10.7812 13.0037C10.7812 12.6475 10.8094 12.3803 10.8703 12.1365C10.9172 11.9443 11.0109 11.6771 11.0766 11.5506C11.1422 11.4193 11.2875 11.2037 11.3953 11.0631C11.5078 10.9224 11.8547 10.6037 12.1641 10.3553C12.4734 10.1068 12.7922 9.82089 12.8719 9.71776C12.9516 9.61932 13.0547 9.45995 13.1016 9.37089C13.1484 9.28182 13.1953 9.08026 13.2094 8.92557C13.2281 8.6912 13.2141 8.60682 13.1203 8.40995C13.0594 8.28339 12.9328 8.12401 12.8438 8.05839C12.7547 7.99276 12.5437 7.89901 12.375 7.85214C12.15 7.7912 11.9672 7.77245 11.6719 7.78651C11.3953 7.80057 11.2031 7.83807 11.0391 7.91307C10.9125 7.96932 10.7437 8.07245 10.6734 8.14276C10.5984 8.21307 10.4484 8.39589 10.3406 8.55057C10.2141 8.7287 10.0734 8.86464 9.95625 8.92089C9.82031 8.98651 9.72188 9.00058 9.5625 8.97714C9.44531 8.96308 9.25781 8.88807 9.14531 8.81776C9.01875 8.74276 8.90156 8.6162 8.84531 8.5037C8.77969 8.38182 8.74687 8.22714 8.75156 8.05839C8.75156 7.87089 8.78906 7.71151 8.90156 7.47245C9.00937 7.24276 9.14063 7.05995 9.34219 6.86307C9.50156 6.70839 9.78281 6.50683 9.96094 6.40839C10.1438 6.31464 10.4344 6.19276 10.6172 6.13651C10.7953 6.08495 11.1328 6.02401 11.3672 6.00058C11.5969 5.98183 11.8828 5.97245 12 5.97714V5.97714ZM11.6953 15.1974C11.8547 15.2068 12.0563 15.2537 12.1641 15.3053C12.2672 15.3521 12.4219 15.4693 12.5109 15.5584C12.6 15.6474 12.7125 15.8068 12.7594 15.9099C12.8063 16.0178 12.8438 16.2099 12.8438 16.3553C12.8438 16.4959 12.8156 16.6974 12.7875 16.8006C12.75 16.9131 12.6328 17.0865 12.4922 17.2318C12.3047 17.424 12.2016 17.4896 11.9766 17.5506C11.7844 17.6068 11.6297 17.6209 11.4844 17.5974C11.3672 17.5787 11.1984 17.5271 11.1094 17.4803C11.0203 17.4334 10.8797 17.3256 10.7953 17.2365C10.7156 17.1521 10.6031 16.9881 10.5516 16.8709C10.4953 16.7537 10.4531 16.5568 10.4531 16.4256C10.4531 16.299 10.4766 16.1162 10.5047 16.0271C10.5375 15.9381 10.6078 15.7974 10.6594 15.7131C10.7156 15.6334 10.8422 15.5021 10.9453 15.4271C11.0484 15.3521 11.1937 15.2678 11.2734 15.2396C11.3484 15.2115 11.5406 15.1928 11.6953 15.1974V15.1974Z"
                          fill="#AAAAAA"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_5599_7999">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                  {t('page.sidebar_questions')}
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  toggleClass: PropTypes.any.isRequired,
  t: PropTypes.func,
};

export { Sidebar };
