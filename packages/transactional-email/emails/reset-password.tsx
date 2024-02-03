import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  render,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface ResetPasswordEmailProps {
  inviteLink: string;
  otp_code: string;
  requested_at: string;
  requested_from: string;
}

export const ResetPasswordEmail = ({ requested_at, requested_from, inviteLink }: ResetPasswordEmailProps) => {
  const previewText = `Password Reset Request`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className='mx-auto my-auto bg-white p-4 font-sans'>
          <Container className='mx-auto my-[40px] p-[20px]'>
            <Text className='text-[14px] leading-[24px] text-black'>Hi,</Text>
            <Text className='text-[14px] leading-[24px] text-black'>
              We&apos;ve received a request to reset the password for your account. To reset your password, please click
              the button below.
            </Text>
            <Section className='mb-[32px] mt-[32px] text-center'>
              <Button
                className='rounded bg-[#CF364C] px-4 py-3 text-center text-[12px] font-semibold text-white no-underline'
                href={inviteLink}
              >
                Reset Password
              </Button>
            </Section>
            <Text className='text-[14px] leading-[24px] text-black'>
              or copy and paste this URL into your browser:{' '}
              <Link href={inviteLink} className='text-blue-600 no-underline'>
                {inviteLink}
              </Link>
            </Text>
            <Text className='text-[14px] leading-[24px] text-black'>Thanks,</Text>
            <Text className='text-[14px] leading-[24px] text-black'>The Tasker Team</Text>
            <Hr className='mx-0 my-[26px] w-full border border-solid border-[#eaeaea]' />
            <Text className='text-[12px] leading-[24px] text-[#666666]'>
              This code was requested from <span className='text-black'>{requested_from}</span> at{' '}
              <span className='text-black'>{requested_at}</span>. If you didn&apos;t make this request, you can safely
              ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export const renderResetPasswordEmail = (props: ResetPasswordEmailProps) =>
  render(<ResetPasswordEmail {...props} />, {
    pretty: true,
  });

export default ResetPasswordEmail;
