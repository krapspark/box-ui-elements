import {
    API_TO_USM_PERMISSION_LEVEL_MAP,
    convertCollabsResponse,
    convertContactsResponse,
    convertItemResponse,
    convertUserResponse,
    convertSharedLinkPermissions,
    convertSharedLinkSettings,
} from '../convertData';
import {
    TYPE_FILE,
    TYPE_FOLDER,
    PERMISSION_CAN_DOWNLOAD,
    PERMISSION_CAN_PREVIEW,
    ACCESS_COLLAB,
    ACCESS_COMPANY,
    ACCESS_OPEN,
} from '../../../../constants';
import {
    ALLOWED_ACCESS_LEVELS,
    ANYONE_IN_COMPANY,
    ANYONE_WITH_LINK,
    CAN_VIEW_DOWNLOAD,
    CAN_VIEW_ONLY,
    PEOPLE_IN_ITEM,
} from '../../constants';
import {
    MOCK_COLLABS_API_RESPONSE,
    MOCK_COLLAB_IDS_CONVERTED,
    MOCK_CONTACTS_API_RESPONSE,
    MOCK_CONTACTS_CONVERTED_RESPONSE,
    MOCK_OWNER,
    MOCK_OWNER_ID,
    MOCK_OWNER_EMAIL,
    MOCK_PASSWORD,
    MOCK_SERVER_URL,
    MOCK_SETTINGS_WITH_ALL_FEATURES,
    MOCK_SETTINGS_DOWNLOAD_PERMISSIONS,
    MOCK_SETTINGS_PREVIEW_PERMISSIONS,
    MOCK_SETTINGS_WITHOUT_DOWNLOAD,
    MOCK_SETTINGS_WITHOUT_EXPIRATION,
    MOCK_SETTINGS_WITHOUT_PASSWORD,
    MOCK_SETTINGS_WITHOUT_VANITY_URL,
    MOCK_TIMESTAMP,
    MOCK_TIMESTAMP_ISO_STRING,
    MOCK_USER_IDS_CONVERTED,
    MOCK_VANITY_URL,
    MOCK_ITEM_PERMISSIONS,
} from '../__mocks__/USMMocks';

jest.mock('../../../../utils/file', () => ({
    getTypedFileId: () => 'f_190457309',
    getTypedFolderId: () => 'd_190457309',
}));

describe('convertItemResponse()', () => {
    const TYPED_FILE_ID = 'f_190457309';
    const TYPED_FOLDER_ID = 'd_190457309';
    const ITEM_ID = '190457309';
    const ITEM_NAME = '<3 Box UI Elements <3';
    const ITEM_DESCRIPTION = 'Why we <3 Box UI Elements';
    const ITEM_SHARED_LINK_URL = 'https://cloud.box.com/s/boxuielementsarethebest';
    const ITEM_SHARED_DOWNLOAD_URL = 'https://cloud.box.com/shared/static/boxuielementsarethebest';
    const ITEM_EXTENSION = '.png';

    const ITEM_SHARED_LINK = {
        access: 'company',
        download_count: 0,
        download_url: ITEM_SHARED_DOWNLOAD_URL,
        effective_access: 'company',
        effective_permission: 'can_download',
        is_password_enabled: false,
        permissions: {
            can_preview: true,
            can_download: true,
        },
        preview_count: 0,
        unshared_at: MOCK_TIMESTAMP_ISO_STRING,
        url: ITEM_SHARED_LINK_URL,
        vanity_name: null,
        vanity_url: null,
    };

    const FULL_PERMISSIONS = {
        can_download: true,
        can_upload: true,
        can_rename: true,
        can_delete: true,
        can_share: true,
        can_invite_collaborator: true,
        can_set_share_access: true,
    };

    const DOWNLOAD_PERMISSIONS = {
        can_download: true,
        can_upload: false,
        can_rename: false,
        can_delete: false,
        can_share: false,
        can_invite_collaborator: false,
        can_set_share_access: false,
    };

    const INVITE_COLLAB_PERMISSIONS = {
        can_download: true,
        can_upload: false,
        can_rename: false,
        can_delete: false,
        can_share: true,
        can_invite_collaborator: true,
        can_set_share_access: false,
    };

    const SET_SHARE_ACCESS_PERMISSIONS = {
        can_download: true,
        can_upload: false,
        can_rename: false,
        can_delete: false,
        can_share: true,
        can_invite_collaborator: true,
        can_set_share_access: true,
    };

    const ALL_SHARED_LINK_FEATURES = {
        vanity_name: true,
        download_url: true,
        password: true,
    };

    const VANITY_NAME_ONLY = {
        vanity_name: true,
        download_url: false,
        password: false,
    };

    const DOWNLOAD_URL_ONLY = {
        vanity_name: false,
        download_url: true,
        password: false,
    };

    const PASSWORD_ONLY = {
        vanity_name: false,
        download_url: false,
        password: true,
    };

    test.each`
        itemType       | extension         | sharedLink          | sharedLinkFeatures          | permissions                     | typedID            | description
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${ALL_SHARED_LINK_FEATURES} | ${FULL_PERMISSIONS}             | ${TYPED_FILE_ID}   | ${'files with no shared link, full permissions, and all shared link features'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${ALL_SHARED_LINK_FEATURES} | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FILE_ID}   | ${'files with no shared link, download permissions, and all shared link features'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${ALL_SHARED_LINK_FEATURES} | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FILE_ID}   | ${'files with no shared link, invite collabs permissions, and all shared link features'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${ALL_SHARED_LINK_FEATURES} | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FILE_ID}   | ${'files with no shared link, set share access permissions, and all shared link features'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${ALL_SHARED_LINK_FEATURES} | ${FULL_PERMISSIONS}             | ${TYPED_FILE_ID}   | ${'files with a shared link, full permissions, and all shared link features'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${ALL_SHARED_LINK_FEATURES} | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FILE_ID}   | ${'files with a shared link, download permissions, and all shared link features'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${ALL_SHARED_LINK_FEATURES} | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FILE_ID}   | ${'files with a shared link, invite collabs permissions, and all shared link features'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${ALL_SHARED_LINK_FEATURES} | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FILE_ID}   | ${'files with a shared link, set share access permissions, and all shared link features'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${VANITY_NAME_ONLY}         | ${FULL_PERMISSIONS}             | ${TYPED_FILE_ID}   | ${'files with no shared link, full permissions, and the vanity URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${VANITY_NAME_ONLY}         | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FILE_ID}   | ${'files with no shared link, download permissions, and the vanity URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${VANITY_NAME_ONLY}         | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FILE_ID}   | ${'files with no shared link, invite collabs permissions, and the vanity URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${VANITY_NAME_ONLY}         | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FILE_ID}   | ${'files with no shared link, set share access permissions, and the vanity URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${VANITY_NAME_ONLY}         | ${FULL_PERMISSIONS}             | ${TYPED_FILE_ID}   | ${'files with a shared link, full permissions, and the vanity URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${VANITY_NAME_ONLY}         | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FILE_ID}   | ${'files with a shared link, download permissions, and the vanity URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${VANITY_NAME_ONLY}         | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FILE_ID}   | ${'files with a shared link, invite collabs permissions, and the vanity URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${VANITY_NAME_ONLY}         | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FILE_ID}   | ${'files with a shared link, set share access permissions, and the vanity URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${DOWNLOAD_URL_ONLY}        | ${FULL_PERMISSIONS}             | ${TYPED_FILE_ID}   | ${'files with no shared link, full permissions, and the download URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${DOWNLOAD_URL_ONLY}        | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FILE_ID}   | ${'files with no shared link, download permissions, and the download URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${DOWNLOAD_URL_ONLY}        | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FILE_ID}   | ${'files with no shared link, invite collabs permissions, and the download URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${DOWNLOAD_URL_ONLY}        | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FILE_ID}   | ${'files with no shared link, set share access permissions, and the download URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${DOWNLOAD_URL_ONLY}        | ${FULL_PERMISSIONS}             | ${TYPED_FILE_ID}   | ${'files with a shared link, full permissions, and the download URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${DOWNLOAD_URL_ONLY}        | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FILE_ID}   | ${'files with a shared link, download permissions, and the download URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${DOWNLOAD_URL_ONLY}        | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FILE_ID}   | ${'files with a shared link, invite collabs permissions, and the download URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${DOWNLOAD_URL_ONLY}        | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FILE_ID}   | ${'files with a shared link, set share access permissions, and the download URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${PASSWORD_ONLY}            | ${FULL_PERMISSIONS}             | ${TYPED_FILE_ID}   | ${'files with no shared link, full permissions, and the password feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${PASSWORD_ONLY}            | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FILE_ID}   | ${'files with no shared link, download permissions, and the password feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${PASSWORD_ONLY}            | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FILE_ID}   | ${'files with no shared link, invite collabs permissions, and the password feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${PASSWORD_ONLY}            | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FILE_ID}   | ${'files with no shared link, set share access permissions, and the password feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${PASSWORD_ONLY}            | ${FULL_PERMISSIONS}             | ${TYPED_FILE_ID}   | ${'files with a shared link, full permissions, and the password feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${PASSWORD_ONLY}            | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FILE_ID}   | ${'files with a shared link, download permissions, and the password feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${PASSWORD_ONLY}            | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FILE_ID}   | ${'files with a shared link, invite collabs permissions, and the password feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${PASSWORD_ONLY}            | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FILE_ID}   | ${'files with a shared link, set share access permissions, and the password feature'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${ALL_SHARED_LINK_FEATURES} | ${FULL_PERMISSIONS}             | ${TYPED_FOLDER_ID} | ${'folders with no shared link, full permissions, and all shared link features'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${ALL_SHARED_LINK_FEATURES} | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FOLDER_ID} | ${'folders with no shared link, download permissions, and all shared link features'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${ALL_SHARED_LINK_FEATURES} | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FOLDER_ID} | ${'folders with no shared link, invite collabs permissions, and all shared link features'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${ALL_SHARED_LINK_FEATURES} | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FOLDER_ID} | ${'folders with no shared link, set share access permissions, and all shared link features'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${ALL_SHARED_LINK_FEATURES} | ${FULL_PERMISSIONS}             | ${TYPED_FOLDER_ID} | ${'folders with a shared link, full permissions, and all shared link features'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${ALL_SHARED_LINK_FEATURES} | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FOLDER_ID} | ${'folders with a shared link, download permissions, and all shared link features'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${ALL_SHARED_LINK_FEATURES} | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FOLDER_ID} | ${'folders with a shared link, invite collabs permissions, and all shared link features'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${ALL_SHARED_LINK_FEATURES} | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FOLDER_ID} | ${'folders with a shared link, set share access permissions, and all shared link features'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${VANITY_NAME_ONLY}         | ${FULL_PERMISSIONS}             | ${TYPED_FOLDER_ID} | ${'folders with no shared link, full permissions, and the vanity URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${VANITY_NAME_ONLY}         | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FOLDER_ID} | ${'folders with no shared link, download permissions, and the vanity URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${VANITY_NAME_ONLY}         | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FOLDER_ID} | ${'folders with no shared link, invite collabs permissions, and the vanity URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${VANITY_NAME_ONLY}         | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FOLDER_ID} | ${'folders with no shared link, set share access permissions, and the vanity URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${VANITY_NAME_ONLY}         | ${FULL_PERMISSIONS}             | ${TYPED_FOLDER_ID} | ${'folders with a shared link, full permissions, and the vanity URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${VANITY_NAME_ONLY}         | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FOLDER_ID} | ${'folders with a shared link, download permissions, and the vanity URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${VANITY_NAME_ONLY}         | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FOLDER_ID} | ${'folders with a shared link, invite collabs permissions, and the vanity URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${VANITY_NAME_ONLY}         | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FOLDER_ID} | ${'folders with a shared link, set share access permissions, and the vanity URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${DOWNLOAD_URL_ONLY}        | ${FULL_PERMISSIONS}             | ${TYPED_FOLDER_ID} | ${'folders with no shared link, full permissions, and the download URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${DOWNLOAD_URL_ONLY}        | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FOLDER_ID} | ${'folders with no shared link, download permissions, and the download URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${DOWNLOAD_URL_ONLY}        | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FOLDER_ID} | ${'folders with no shared link, invite collabs permissions, and the download URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${DOWNLOAD_URL_ONLY}        | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FOLDER_ID} | ${'folders with no shared link, set share access permissions, and the download URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${DOWNLOAD_URL_ONLY}        | ${FULL_PERMISSIONS}             | ${TYPED_FOLDER_ID} | ${'folders with a shared link, full permissions, and the download URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${DOWNLOAD_URL_ONLY}        | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FOLDER_ID} | ${'folders with a shared link, download permissions, and the download URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${DOWNLOAD_URL_ONLY}        | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FOLDER_ID} | ${'folders with a shared link, invite collabs permissions, and the download URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${DOWNLOAD_URL_ONLY}        | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FOLDER_ID} | ${'folders with a shared link, set share access permissions, and the download URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${PASSWORD_ONLY}            | ${FULL_PERMISSIONS}             | ${TYPED_FOLDER_ID} | ${'folders with no shared link, full permissions, and the password feature'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${PASSWORD_ONLY}            | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FOLDER_ID} | ${'folders with no shared link, download permissions, and the password feature'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${PASSWORD_ONLY}            | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FOLDER_ID} | ${'folders with no shared link, invite collabs permissions, and the password feature'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${PASSWORD_ONLY}            | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FOLDER_ID} | ${'folders with no shared link, set share access permissions, and the password feature'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${PASSWORD_ONLY}            | ${FULL_PERMISSIONS}             | ${TYPED_FOLDER_ID} | ${'folders with a shared link, full permissions, and the password feature'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${PASSWORD_ONLY}            | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FOLDER_ID} | ${'folders with a shared link, download permissions, and the password feature'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${PASSWORD_ONLY}            | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FOLDER_ID} | ${'folders with a shared link, invite collabs permissions, and the password feature'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${PASSWORD_ONLY}            | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FOLDER_ID} | ${'folders with a shared link, set share access permissions, and the password feature'}
    `(
        'should convert $description',
        ({ itemType, extension, sharedLink, sharedLinkFeatures, permissions, typedID }) => {
            const responseFromAPI = {
                allowed_invitee_roles: ['editor', 'viewer'],
                description: ITEM_DESCRIPTION,
                etag: '1',
                extension,
                id: ITEM_ID,
                name: ITEM_NAME,
                owned_by: MOCK_OWNER,
                permissions,
                shared_link: sharedLink,
                shared_link_features: sharedLinkFeatures,
                type: itemType,
            };
            const { can_download, can_invite_collaborator, can_preview, can_set_share_access, can_share } = permissions;

            const { download_url, effective_permission, is_password_enabled, url, vanity_name } = Object(sharedLink);

            const { download_url: isDirectLinkAvailable, password } = sharedLinkFeatures;

            const convertedResponse = {
                item: {
                    canUserSeeClassification: false,
                    description: ITEM_DESCRIPTION,
                    extension,
                    grantedPermissions: {
                        itemShare: can_share,
                    },
                    hideCollaborators: false,
                    id: ITEM_ID,
                    name: ITEM_NAME,
                    ownerEmail: MOCK_OWNER_EMAIL,
                    ownerID: MOCK_OWNER_ID,
                    permissions,
                    type: itemType,
                    typedID,
                },
                sharedLink: sharedLink
                    ? {
                          accessLevel: ANYONE_IN_COMPANY,
                          allowedAccessLevels: ALLOWED_ACCESS_LEVELS,
                          canChangeAccessLevel: can_set_share_access,
                          canChangeDownload: can_set_share_access && can_download,
                          canChangeExpiration: can_set_share_access,
                          canChangePassword: can_set_share_access && password,
                          canChangeVanityName: false,
                          canInvite: can_invite_collaborator,
                          directLink: download_url,
                          expirationTimestamp: MOCK_TIMESTAMP,
                          isDirectLinkAvailable,
                          isDownloadAllowed: can_download,
                          isDownloadAvailable: can_download,
                          isDownloadEnabled: can_download,
                          isDownloadSettingAvailable: can_download,
                          isEditAllowed: true,
                          isNewSharedLink: false,
                          isPasswordAvailable: password,
                          isPasswordEnabled: is_password_enabled,
                          isPreviewAllowed: can_preview,
                          permissionLevel: API_TO_USM_PERMISSION_LEVEL_MAP[effective_permission],
                          url,
                          vanityName: vanity_name || '',
                      }
                    : { canInvite: can_invite_collaborator },
            };

            expect(convertItemResponse(responseFromAPI)).toEqual(convertedResponse);
        },
    );

    test.each`
        access            | permission                 | expectedIsDownloadAllowed | expectedCanChangeDownload | description
        ${ACCESS_COLLAB}  | ${PERMISSION_CAN_DOWNLOAD} | ${true}                   | ${false}                  | ${'access is "collab" and shared link permission is "can_download"'}
        ${ACCESS_COMPANY} | ${PERMISSION_CAN_DOWNLOAD} | ${true}                   | ${true}                   | ${'access is "company" and shared link permission is "can_download"'}
        ${ACCESS_OPEN}    | ${PERMISSION_CAN_DOWNLOAD} | ${true}                   | ${true}                   | ${'access is "open" and shared link permission is "can_download"'}
        ${ACCESS_COLLAB}  | ${PERMISSION_CAN_PREVIEW}  | ${false}                  | ${false}                  | ${'access is "collab" and shared link permission is "can_preview"'}
        ${ACCESS_COMPANY} | ${PERMISSION_CAN_PREVIEW}  | ${false}                  | ${true}                   | ${'access is "company" and shared link permission is "can_preview"'}
        ${ACCESS_OPEN}    | ${PERMISSION_CAN_PREVIEW}  | ${false}                  | ${true}                   | ${'access is "open" and shared link permission is "can_preview"'}
    `(
        'should set download properties correctly when $description',
        ({ access, permission, expectedIsDownloadAllowed, expectedCanChangeDownload }) => {
            const responseFromAPI = {
                allowed_invitee_roles: ['editor', 'viewer'],
                description: ITEM_DESCRIPTION,
                etag: '1',
                id: ITEM_ID,
                name: ITEM_NAME,
                owned_by: MOCK_OWNER,
                permissions: MOCK_ITEM_PERMISSIONS,
                shared_link: { ...ITEM_SHARED_LINK, effective_access: access, effective_permission: permission },
                shared_link_features: ALL_SHARED_LINK_FEATURES,
                type: TYPE_FILE,
            };
            const {
                sharedLink: { canChangeDownload, isDownloadAllowed },
            } = convertItemResponse(responseFromAPI);
            expect(canChangeDownload).toBe(expectedCanChangeDownload);
            expect(isDownloadAllowed).toBe(expectedIsDownloadAllowed);
        },
    );
});

describe('convertUserResponse()', () => {
    const USER_ID = '79035428903';
    const ENTERPRISE_NAME = 'Best Enterprise Ever';
    const ENTERPRISE = {
        name: ENTERPRISE_NAME,
    };
    const HOSTNAME = 'https://cloud.box.com/';

    test.each`
        enterprise    | hostname    | enterpriseName     | serverURL          | description
        ${ENTERPRISE} | ${HOSTNAME} | ${ENTERPRISE_NAME} | ${MOCK_SERVER_URL} | ${'enterprise and hostname exist'}
        ${ENTERPRISE} | ${null}     | ${ENTERPRISE_NAME} | ${''}              | ${'enterprise exists, but not hostname'}
        ${null}       | ${HOSTNAME} | ${''}              | ${MOCK_SERVER_URL} | ${'hostname exists, but not enterprise'}
        ${null}       | ${null}     | ${''}              | ${''}              | ${'neither enterprise nor hostname exists'}
    `('should convert data when $description', ({ enterprise, hostname, enterpriseName, serverURL }) => {
        const responseFromAPI = {
            enterprise,
            hostname,
            id: USER_ID,
        };

        const convertedResponse = {
            id: USER_ID,
            userEnterpriseData: {
                enterpriseName,
                serverURL,
            },
        };

        expect(convertUserResponse(responseFromAPI)).toEqual(convertedResponse);
    });
});

describe('convertSharedLinkPermissions', () => {
    test.each`
        permissionLevel      | result
        ${CAN_VIEW_DOWNLOAD} | ${{ [PERMISSION_CAN_DOWNLOAD]: true, [PERMISSION_CAN_PREVIEW]: false }}
        ${CAN_VIEW_ONLY}     | ${{ [PERMISSION_CAN_DOWNLOAD]: false, [PERMISSION_CAN_PREVIEW]: true }}
    `('should return the correct result for the $permissionLevel permission level', ({ permissionLevel, result }) => {
        expect(convertSharedLinkPermissions(permissionLevel)).toEqual(result);
    });
});

describe('convertSharedLinkSettings', () => {
    test.each`
        newSettings                         | permissions                           | unsharedAt                   | vanityUrl          | serverURL          | description
        ${MOCK_SETTINGS_WITH_ALL_FEATURES}  | ${MOCK_SETTINGS_DOWNLOAD_PERMISSIONS} | ${MOCK_TIMESTAMP_ISO_STRING} | ${MOCK_VANITY_URL} | ${MOCK_SERVER_URL} | ${'with all features'}
        ${MOCK_SETTINGS_WITHOUT_DOWNLOAD}   | ${MOCK_SETTINGS_PREVIEW_PERMISSIONS}  | ${MOCK_TIMESTAMP_ISO_STRING} | ${MOCK_VANITY_URL} | ${MOCK_SERVER_URL} | ${'without disallowed direct downloads'}
        ${MOCK_SETTINGS_WITHOUT_EXPIRATION} | ${MOCK_SETTINGS_DOWNLOAD_PERMISSIONS} | ${null}                      | ${MOCK_VANITY_URL} | ${MOCK_SERVER_URL} | ${'without an expiration date'}
        ${MOCK_SETTINGS_WITHOUT_PASSWORD}   | ${MOCK_SETTINGS_DOWNLOAD_PERMISSIONS} | ${MOCK_TIMESTAMP_ISO_STRING} | ${MOCK_VANITY_URL} | ${MOCK_SERVER_URL} | ${'without a password'}
        ${MOCK_SETTINGS_WITHOUT_VANITY_URL} | ${MOCK_SETTINGS_DOWNLOAD_PERMISSIONS} | ${MOCK_TIMESTAMP_ISO_STRING} | ${''}              | ${MOCK_SERVER_URL} | ${'without a vanity name'}
        ${MOCK_SETTINGS_WITH_ALL_FEATURES}  | ${MOCK_SETTINGS_DOWNLOAD_PERMISSIONS} | ${MOCK_TIMESTAMP_ISO_STRING} | ${''}              | ${null}            | ${'without a server URL'}
    `(
        'should convert a shared link settings USM object $description when the accessLevel is ANYONE_IN_COMPANY',
        ({ newSettings, permissions, unsharedAt, serverURL, vanityUrl }) => {
            // "password" should not exist in the converted object
            expect(convertSharedLinkSettings(newSettings, ANYONE_IN_COMPANY, serverURL)).toEqual({
                permissions,
                unshared_at: unsharedAt,
                vanity_url: vanityUrl,
            });
        },
    );
    test.each`
        newSettings                         | unsharedAt                   | vanityUrl          | serverURL          | description
        ${MOCK_SETTINGS_WITH_ALL_FEATURES}  | ${MOCK_TIMESTAMP_ISO_STRING} | ${MOCK_VANITY_URL} | ${MOCK_SERVER_URL} | ${'with all features'}
        ${MOCK_SETTINGS_WITHOUT_DOWNLOAD}   | ${MOCK_TIMESTAMP_ISO_STRING} | ${MOCK_VANITY_URL} | ${MOCK_SERVER_URL} | ${'without disallowed direct downloads'}
        ${MOCK_SETTINGS_WITHOUT_EXPIRATION} | ${null}                      | ${MOCK_VANITY_URL} | ${MOCK_SERVER_URL} | ${'without an expiration date'}
        ${MOCK_SETTINGS_WITHOUT_PASSWORD}   | ${MOCK_TIMESTAMP_ISO_STRING} | ${MOCK_VANITY_URL} | ${MOCK_SERVER_URL} | ${'without a password'}
        ${MOCK_SETTINGS_WITHOUT_VANITY_URL} | ${MOCK_TIMESTAMP_ISO_STRING} | ${''}              | ${MOCK_SERVER_URL} | ${'without a vanity name'}
        ${MOCK_SETTINGS_WITH_ALL_FEATURES}  | ${MOCK_TIMESTAMP_ISO_STRING} | ${''}              | ${null}            | ${'without a server URL'}
    `(
        'should convert a shared link settings USM object $description when the accessLevel is PEOPLE_IN_ITEM',
        ({ newSettings, unsharedAt, serverURL, vanityUrl }) => {
            // "password" and "permissions" should not exist in the converted object
            expect(convertSharedLinkSettings(newSettings, PEOPLE_IN_ITEM, serverURL)).toEqual({
                unshared_at: unsharedAt,
                vanity_url: vanityUrl,
            });
        },
    );

    test.each`
        newSettings                         | permissions                           | unsharedAt                   | vanityUrl          | password         | serverURL          | description
        ${MOCK_SETTINGS_WITH_ALL_FEATURES}  | ${MOCK_SETTINGS_DOWNLOAD_PERMISSIONS} | ${MOCK_TIMESTAMP_ISO_STRING} | ${MOCK_VANITY_URL} | ${MOCK_PASSWORD} | ${MOCK_SERVER_URL} | ${'with all features'}
        ${MOCK_SETTINGS_WITHOUT_DOWNLOAD}   | ${MOCK_SETTINGS_PREVIEW_PERMISSIONS}  | ${MOCK_TIMESTAMP_ISO_STRING} | ${MOCK_VANITY_URL} | ${MOCK_PASSWORD} | ${MOCK_SERVER_URL} | ${'without disallowed direct downloads'}
        ${MOCK_SETTINGS_WITHOUT_EXPIRATION} | ${MOCK_SETTINGS_DOWNLOAD_PERMISSIONS} | ${null}                      | ${MOCK_VANITY_URL} | ${MOCK_PASSWORD} | ${MOCK_SERVER_URL} | ${'without an expiration date'}
        ${MOCK_SETTINGS_WITHOUT_PASSWORD}   | ${MOCK_SETTINGS_DOWNLOAD_PERMISSIONS} | ${MOCK_TIMESTAMP_ISO_STRING} | ${MOCK_VANITY_URL} | ${null}          | ${MOCK_SERVER_URL} | ${'without a password'}
        ${MOCK_SETTINGS_WITHOUT_VANITY_URL} | ${MOCK_SETTINGS_DOWNLOAD_PERMISSIONS} | ${MOCK_TIMESTAMP_ISO_STRING} | ${''}              | ${MOCK_PASSWORD} | ${MOCK_SERVER_URL} | ${'without a vanity name'}
        ${MOCK_SETTINGS_WITH_ALL_FEATURES}  | ${MOCK_SETTINGS_DOWNLOAD_PERMISSIONS} | ${MOCK_TIMESTAMP_ISO_STRING} | ${''}              | ${MOCK_PASSWORD} | ${null}            | ${'without a server URL'}
    `(
        'should convert a shared link settings USM object $description when the accessLevel is ANYONE_WITH_LINK',
        ({ newSettings, password, permissions, unsharedAt, serverURL, vanityUrl }) => {
            // All fields should exist in the converted object
            expect(convertSharedLinkSettings(newSettings, ANYONE_WITH_LINK, serverURL)).toEqual({
                password,
                permissions,
                unshared_at: unsharedAt,
                vanity_url: vanityUrl,
            });
        },
    );
});

describe('convertCollabsResponse', () => {
    test.each`
        isCurrentUserOwner | description
        ${true}            | ${'the owner'}
        ${false}           | ${'not the owner'}
    `(
        'should correctly convert a Collaborations API response when the current user is $description',
        ({ isCurrentUserOwner }) => {
            const convertedResponse = {
                collaborators: [
                    {
                        collabID: MOCK_COLLAB_IDS_CONVERTED[0],
                        email: 'contentexplorer@box.com',
                        hasCustomAvatar: false,
                        imageURL: null,
                        isExternalCollab: false,
                        name: 'Content Explorer',
                        translatedRole: 'Editor',
                        type: 'user',
                        userID: MOCK_USER_IDS_CONVERTED[0],
                    },
                    {
                        collabID: MOCK_COLLAB_IDS_CONVERTED[1],
                        email: 'contentpreview@box.com',
                        hasCustomAvatar: false,
                        imageURL: null,
                        isExternalCollab: false,
                        name: 'Content Preview',
                        translatedRole: 'Editor',
                        type: 'user',
                        userID: MOCK_USER_IDS_CONVERTED[1],
                    },
                    {
                        collabID: MOCK_COLLAB_IDS_CONVERTED[2],
                        email: 'contentpicker@box.com',
                        expiration: {
                            executeAt: '2020-07-09T14:53:12-08:00',
                        },
                        hasCustomAvatar: false,
                        imageURL: null,
                        isExternalCollab: false,
                        name: 'Content Picker',
                        translatedRole: 'Editor',
                        type: 'user',
                        userID: MOCK_USER_IDS_CONVERTED[2],
                    },
                    {
                        collabID: MOCK_COLLAB_IDS_CONVERTED[3],
                        email: 'contentuploader@box.com',
                        hasCustomAvatar: false,
                        imageURL: null,
                        isExternalCollab: false,
                        name: 'Content Uploader',
                        translatedRole: 'Editor',
                        type: 'user',
                        userID: MOCK_USER_IDS_CONVERTED[3],
                    },
                    {
                        collabID: MOCK_COLLAB_IDS_CONVERTED[4],
                        email: 'demo@boxworks.com',
                        hasCustomAvatar: false,
                        imageURL: null,
                        isExternalCollab: !!isCurrentUserOwner,
                        name: 'BoxWorks Demo',
                        translatedRole: 'Viewer',
                        type: 'user',
                        userID: MOCK_USER_IDS_CONVERTED[4],
                    },
                ],
            };
            expect(convertCollabsResponse(MOCK_COLLABS_API_RESPONSE, MOCK_OWNER_EMAIL, isCurrentUserOwner)).toEqual(
                convertedResponse,
            );
        },
    );

    test('should return an object with an empty array if there are no collaborations', () => {
        expect(convertCollabsResponse({ total_count: 0, entries: [] }, MOCK_OWNER_EMAIL, true)).toEqual({
            collaborators: [],
        });
    });
});

describe('convertContactsResponse()', () => {
    test('should return all users except the current user', () => {
        expect(convertContactsResponse(MOCK_CONTACTS_API_RESPONSE, MOCK_OWNER_ID)).toEqual(
            MOCK_CONTACTS_CONVERTED_RESPONSE,
        );
    });

    test('should return an empty array if there are no available users', () => {
        expect(convertContactsResponse({ total_count: 0, entries: [] }, MOCK_OWNER_ID)).toEqual([]);
    });
});
