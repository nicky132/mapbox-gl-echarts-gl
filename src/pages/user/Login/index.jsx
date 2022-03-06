import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { Alert, message, Tabs } from 'antd';
import React, { useState,useRef } from 'react';
import { ProFormCaptcha, ProFormCheckbox, ProFormText, LoginForm } from '@ant-design/pro-form';
import { useIntl, history, FormattedMessage, SelectLang, useModel } from 'umi';
import Footer from '@/components/Footer';
import { login, getAuthRoute, queryCurrentUser } from '@/services/ant-design-pro/api';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import errorHandler from '@/errorHandler';
import styles from './index.less';
const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);
/**
 *
 * @returns 获取用户名密码
 */
const getPassword = () => {
  try {
    return localStorage.getItem('password');
  } catch (error) {
    return '';
  }
};

const Login = () => {
  const [userLoginState, setUserLoginState] = useState({});
  const [type, setType] = useState('account');
  const [isGuest, setIsGuest] = useState(true);
  const { initialState, setInitialState } = useModel('@@initialState');
  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };

  const fetchUserAuthRoute = async () => {
    //获取授权路由
    const msg = await getAuthRoute({});
    if (msg.success) {
      //更新用户授权的路由状态
      if (msg.resultData.length) {
        setInitialState((s) => ({ ...s, authRoutes: msg.resultData }));
      }
    }
  };

  const handleSubmit = async (values) => {
    if (values.autoLogin) {
      localStorage.setItem('password', values.password);
    } else {
      localStorage.setItem('password', '');
    }
    try {
      // 登录
      const msg = await login({ ...values, type });
      if (msg.success) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultLoginSuccessMessage);
        setInitialState((s) => ({ ...s, token: msg.data?.access_token }));
        localStorage.setItem('token', msg.data?.access_token);
        await fetchUserInfo();
        await fetchUserAuthRoute();

        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query;
        history.push(redirect || '/dataview');
        return;
      }
      setUserLoginState(msg);
    } catch (error) {
      errorHandler(error);
    }
  };
  const formRef = useRef('form');
  const { status, type: loginType } = userLoginState;
  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <LoginForm
          formRef={formRef}
          onValuesChange={async (changedValues, allValues) => {
            if (changedValues.username == 'admin') {
              setIsGuest(false);
              formRef.current?.setFieldsValue({
                password: '',
              });
            } else {
              setIsGuest(true);
            }
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          // title="Ant Design"
          title="欢迎登录"
          subTitle={intl.formatMessage({
            id: 'pages.layouts.userLayout._title',
          })}
          initialValues={{
            autoLogin: true,
          }}
          actions={
            [
              // <FormattedMessage
              //   key="loginWith"
              //   id="pages.login.loginWith"
              //   defaultMessage="其他登录方式"
              // />,
              // <AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.icon} />,
              // <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.icon} />,
              // <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.icon} />,
            ]
          }
          onFinish={async (values) => {
            await handleSubmit(values);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane
              key="account"
              tab={intl.formatMessage({
                id: 'pages.login.accountLogin.tab',
                defaultMessage: '账户密码登录',
              })}
            />
            {/* <Tabs.TabPane
              key="mobile"
              tab={intl.formatMessage({
                id: 'pages.login.phoneLogin.tab',
                defaultMessage: '手机号登录',
              })}
            /> */}
          </Tabs>

          {status === 'error' && loginType === 'account' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误(admin/ant.design)',
              })}
            />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                initialValue="guest"
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username._placeholder',
                  defaultMessage: '用户名: guest',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入用户名!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                /* initialValue={getPassword()} */
                initialValue="abcde"
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={isGuest?intl.formatMessage({
                  id: 'pages.login.password._placeholder',
                  defaultMessage: '密码: abcde',
                }):''}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
            </>
          )}

          {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误" />}
          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined className={styles.prefixIcon} />,
                }}
                name="mobile"
                placeholder={intl.formatMessage({
                  id: 'pages.login.phoneNumber.placeholder',
                  defaultMessage: '手机号',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.required"
                        defaultMessage="请输入手机号！"
                      />
                    ),
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.invalid"
                        defaultMessage="手机号格式错误！"
                      />
                    ),
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.captcha.placeholder',
                  defaultMessage: '请输入验证码',
                })}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${intl.formatMessage({
                      id: 'pages.getCaptchaSecondText',
                      defaultMessage: '获取验证码',
                    })}`;
                  }

                  return intl.formatMessage({
                    id: 'pages.login.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  });
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.captcha.required"
                        defaultMessage="请输入验证码！"
                      />
                    ),
                  },
                ]}
                onGetCaptcha={async (phone) => {
                  const result = await getFakeCaptcha({
                    phone,
                  });

                  if (result === false) {
                    return;
                  }

                  message.success('获取验证码成功！验证码为：1234');
                }}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              <FormattedMessage id="pages.login._rememberMe" defaultMessage="记住密码" />
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
            </a>
          </div>
        </LoginForm>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Login;
