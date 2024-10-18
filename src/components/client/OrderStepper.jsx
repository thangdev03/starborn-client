import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Check from '@mui/icons-material/Check';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';
import { colors } from '../../services/const';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import { createUTCDate } from '../../utils/timeUtils';

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
        backgroundColor: "#45C266"
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
        backgroundColor: "#45C266",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

const ColorlibStepIconRoot = styled('div')(({ theme }) => ({
  backgroundColor: '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundColor: "#45C266",
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundColor: "#45C266",
      },
    },
  ],
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <AssignmentOutlinedIcon />,
    2: <PaymentsOutlinedIcon />,
    3: <LocalShippingOutlinedIcon />,
    4: <StarOutlineRoundedIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

// const steps = ['Đơn hàng đã đặt', 'Chờ xác nhận', 'Đang giao hàng', 'Đánh giá'];

export default function OrderStepper({ data }) {
  const steps = [
    {
      step: 0,
      label: 'Đơn hàng đã đặt',
      timestamp: data?.created_at
    },
    {
      step: 1,
      label: data?.confirmed_at ? 'Đã xác nhận' : 'Chờ xác nhận',
      timestamp: data?.confirmed_at
    },
    {
      step: 2,
      label: data?.received_at ? 'Đã giao hàng' : 'Đang giao hàng',
      timestamp: data?.received_at ? data?.received_at : data?.shipped_at
    },
    {
      step: 3,
      label: 'Đánh giá',
      timestamp: null
    }
  ]
  return (
    <Stack sx={{ width: '100%' }} spacing={4}>
      <Stepper alternativeLabel activeStep={data?.status} connector={<ColorlibConnector />}>
        {steps.map((item) => (
          <Step key={item.step}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{item.label}</StepLabel>
            {/* <Typography textAlign={"center"} fontSize={"12px"}>{item.timestamp && new dayjs(item.timestamp).format("HH:mm DD-MM-YYYY")}</Typography> */}
            <Typography textAlign={"center"} fontSize={"12px"}>{item.timestamp && new Date(item.timestamp)?.toLocaleString()}</Typography>
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
}