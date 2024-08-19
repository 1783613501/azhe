<template>
  <div style="height: calc(88vh); width: 100%">
    <el-row
      v-for="(it, id) in config"
      :key="id"
      :gutter="it.gutter"
      :style="it.style"
    >
      <el-col
        v-for="(it2, id2) in it.row"
        :key="id2"
        :span="it2.span"
        :style="it2.style"
      >
        <template v-if="it2.type == 'col'">
          <el-col
            v-for="(it3, id3) in it2.data"
            :key="id3"
            :span="it3.span"
            :style="it3.style"
          >
            <template v-if="it3.type == 'col'">
              <el-col
                v-for="(it4, id4) in it3.data"
                :key="id4"
                :span="it4.span"
                :style="it4.style"
              >
                <modules :data="it4"></modules>
              </el-col>
            </template>
            <modules v-if="it3.type != 'col'" :data="it3"></modules>
          </el-col>
        </template>
        <modules v-if="it2.type != 'col'" :data="it2"></modules>
      </el-col>
    </el-row>
    <el-dialog
      :modal="false"
      :visible.sync="dialog.visible"
      :title="dialog.title"
      style="height: 100%; width: 100%"
    >
      <el-form
        :model="dialog"
        class="demo-form-inline"
        label-width="300px"
        :rules="rules"
        ref="orderForm"
      >
        <el-form-item label="实返积分" style="width: 70%" prop="resMark">
          <el-input v-model.number="dialog.resMark"></el-input>
        </el-form-item>
      </el-form>
      <div style="padding-left: 20px; text-align: center; margin-top: 30px">
        请确认操作审核通过？审核通过后该订单状态变更为“已完成”，相关积分将自动“实返积分”发放到用户账号
      </div>
      <span slot="footer">
        <el-button
          type="primary"
          @click="
            () => this.$bus.$emit(dialog.busEmit, dialog.resMark, '确认审核')
          "
          >确定</el-button
        >
        <el-button @click="() => (dialog.visible = false)">返回</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :modal="false"
      :visible.sync="rejectDialog.visible"
      :title="rejectDialog.title"
      style="height: 100%; width: 100%"
    >
      <el-form
        :model="rejectDialog"
        class="demo-form-inline"
        label-width="300px"
        :rules="rejectDialogRules"
        ref="orderRejectForm"
      >
        <el-form-item label="驳回原因" style="width: 70%" prop="reason">
          <el-input v-model.number="rejectDialog.reason"></el-input>
        </el-form-item>
        <el-form-item label="是否短信通知用户" style="width: 70%" prop="reason">
          <el-switch v-model="rejectDialog.notify" active-text="" inactive-text="">
          </el-switch>
        </el-form-item>
      </el-form>
      <div style="padding-left: 20px; text-align: center">
        请确认操作审核驳回？审核通过后订单状态该变更为“已驳回”，不可继续操作订单。积分将不进行发放
      </div>
      <span slot="footer">
        <el-button
          type="primary"
          @click="
            () =>
              this.$bus.$emit(rejectDialog.busEmit, rejectDialog, '确认驳回')
          "
          >确定</el-button
        >
        <el-button @click="() => (rejectDialog.visible = false)"
          >返回</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      :modal="false"
      :visible.sync="orderViewDialog.visible"
      :title="orderViewDialog.title"
      style="height: 100%; width: 100%"
      class="orderViewDialog"
    >
      <div
        style="padding-left: 20px; display: flex; flex-wrap: wrap"
        v-if="orderViewDialog.data"
      >
        <div style="width:30%;line-height: 30px;">
          <div
            style="
              width: 100%;
              display: flex;
              align-items: center;
            "
          >
            <img
              v-if="orderViewDialog.data.mediaTypeName == '美团外卖'"
              src="../../../public/images/mt.png"
              style="width: 60px; height: 60px"
            />
            <img
              v-else
              src="../../../public/images/elm.png"
              style="width: 60px; height: 60px"
            />
            <el-button
              :style="orderViewDialog.data.style + 'height:30px;padding:0 15px;margin-left:10px'"
              >{{ orderViewDialog.data.statusName }}</el-button
            >
          </div>
          <div style="width: 100%;">
            商家编码：{{ orderViewDialog.data.businessCode }}
          </div>
          <div style="width: 100%;">
            商家名称：{{ orderViewDialog.data.businessName }}
          </div>
          <div style="width: 100%;">
            渠道：{{ orderViewDialog.data.mediaTypeName }}
          </div>
          <div style="width: 100%;">
            渠道订单号：{{ orderViewDialog.data.orderNo }}
          </div>
          <div style="width: 100%;">
            任务规则：{{ orderViewDialog.data.activityDescription }}
          </div>
          <div style="width: 100%;">
            实付金额(元)：{{ orderViewDialog.data.amount }}
          </div>
          <div style="width: 100%;">
            是否需要好评：{{
              orderViewDialog.data.favourableComment == 1 ? "是" : "否"
            }}
          </div>
          <div style="width: 100%;;">
            任务要求：{{ orderViewDialog.data.taskRecommendedWords }}
          </div>
          <div style="width: 100%;">
            是否好评：{{ orderViewDialog.data.isFiveStar }} <span v-if="orderViewDialog.data.fiveFavorableDate">({{ orderViewDialog.data.fiveFavorableDate }})</span>
          </div>
          <div style="width: 100%;">
            订单标记：{{ orderViewDialog.data.orderFlagName }}
          </div>
          <div style="width: 100%;;display: flex;">
            <div style="white-space: nowrap;">风险备注：</div>
            <div>{{ orderViewDialog.data.riskRemarks }}</div>
          </div>
          <div style="width: 100%;">
            点单时间：
            <span v-if="orderViewDialog.data.signUpBeginDate && orderViewDialog.data.signUpEndDate"> 
              {{ orderViewDialog.data.signUpBeginDate }} ~ {{ orderViewDialog.data.signUpEndDate }}
            </span>
          </div>
          <div style="width: 100%;">
            报名时间：{{ orderViewDialog.data.createTimeString }}
          </div>
          <div style="width: 100%;">
            提交时间：{{ orderViewDialog.data.submitTimeString }}
          </div>
          <!-- <div style="width: 50%; ">
            用户：{{ orderViewDialog.data.userName }}
          </div> -->
          <div style="width: 100%;">
            用户电话：{{ orderViewDialog.data.phone }}
          </div>
          <div style="width: 100%;;display: flex;">
            <div style="white-space: nowrap;">备注：</div>
            <div>{{ orderViewDialog.data.remarks }}</div>
          </div>
          
          <!-- <div style="width: 50%; ">
            任务发布时间：{{ orderViewDialog.data.taskPublishTimeString }}
          </div>
          
          <div style="width: 50%; ">
            应返积分：{{ orderViewDialog.data.points }}
          </div> -->
          
        </div>
        <div style="display:flex;width:70%;justify-content: space-between;">
          <div style="width: 32.5%;">
            <div style="margin-bottom:10px">店名和实付金额截图：</div>
            <el-image
              v-if="orderViewDialog.data.amountImageUrl"
              style="width: 100%"
              :src="orderViewDialog.data.amountImageUrl"
              :preview-src-list="
                orderViewDialog.data.imgSrcList
                  ? orderViewDialog.data.imgSrcList
                  : [orderViewDialog.data.amountImageUrl]
              "
            >
            </el-image>
          </div>
          <div style="width: 32.5%;">
            <div style="margin-bottom:10px">订单编号截图：</div>
            <el-image
              v-if="orderViewDialog.data.orderImageUrl"
              style="width: 100%"
              :src="orderViewDialog.data.orderImageUrl"
              :preview-src-list="
                orderViewDialog.data.imgSrcList
                  ? orderViewDialog.data.imgSrcList
                  : [orderViewDialog.data.orderImageUrl]
              "
            >
            </el-image>
          </div>
          <div style="width: 33%;">
            <div style="margin-bottom:10px">评价截图：</div>
            <el-image
              v-if="orderViewDialog.data.commentImageUrl"
              style="width: 100%"
              :src="orderViewDialog.data.commentImageUrl"
              :preview-src-list="
                orderViewDialog.data.imgSrcList
                  ? orderViewDialog.data.imgSrcList
                  : [orderViewDialog.data.commentImageUrl]
              "
            >
            </el-image>
          </div>
          
        </div>
        
      </div>
      <div slot="footer">
        <el-button @click="() => (orderViewDialog.visible = false)"
          >返回</el-button
        >
        <el-button
          v-if="orderViewDialog.title == '审核'"
          @click="
            () =>
              this.$bus.$emit(
                orderViewDialog.busEmit,
                orderViewDialog.data,
                '单个审核通过'
              )
          "
          >审核通过</el-button
        >
        <el-button
          v-if="orderViewDialog.title == '审核'"
          @click="
            () =>
              this.$bus.$emit(
                orderViewDialog.busEmit,
                orderViewDialog.data,
                '单个审核驳回'
              )
          "
          >审核驳回</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import config from "../../../public/config/orderManage/index";
export default {
  name: "orderList",
  components: {
    modules: () => import("../Modules"),
  },
  data() {
    let taskRuleReturn = (rule, value, callback) => {
      if (value > this.dialog.taskRuleReturn) {
        callback(
          new Error("实返积分不能大于" + this.dialog.taskRuleReturn + " ！")
        );
      } else {
        callback();
      }
    };
    return {
      config: [],
      dialog: {},
      rejectDialog: {},
      orderViewDialog: {},
      rules: {
        resMark: [
          { required: true, message: "请输入实返积分", trigger: "blur" },
          { type: "number", message: "请输入数字", trigger: "blur" },
          { validator: taskRuleReturn, trigger: "blur" },
        ],
      },
      rejectDialogRules: {
        reason: [
          { required: true, message: "请输入驳回原因", trigger: "blur" },
        ],
      },
    };
  },
  created() {},
  mounted() {
    console.log(6666);
    let name = config.CreatedBusOn;
    this.dialog = config.dialog;
    this.rejectDialog = config.rejectDialog;
    this.orderViewDialog = config.orderViewDialog;
    this.$bus.$off(name);
    this.$bus.$on(name, config.uiGetshopList);
    config.uigetThis(this);
    config.uiGetshopList("", "查询");
    this.config = config.config;
  },
  methods: {
    //页面汇总
    uiSetShopList(data, type) {
      config.uiGetshopList(data, type);
    },
  },
  destroyed() {
    if (config.CreatedbusOn) {
      this.$bus.$off(config.CreatedbusOn);
    }
  },
};
</script>

<style scoped>
/deep/ .el-dialog__footer {
  border-top: 1px solid #ccc;
  padding: 10px;
}
/deep/ .el-dialog {
  height: auto;
  width: 60%;
  margin-top: 2vh !important;
  overflow: hidden;
}
/deep/ .el-dialog__header {
  text-align: center;
  border-bottom: 1px solid #ccc;
}
/deep/ .orderViewDialog {
  z-index: 2000 !important;
}
/deep/ .orderViewDialog .el-dialog{
  height: calc(100% - 4vh);
  width: 80%;
}
/deep/ .orderViewDialog .el-dialog .el-dialog__body{
  height: calc(100% - 108px);
  padding-bottom: 10px;
  overflow: auto;
}
</style>
